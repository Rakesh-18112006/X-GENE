import { google } from "googleapis";
import fs from "fs";
import User from "../models/userModel.js"; // ✅ Make sure this model exists

// ✅ Load credentials safely
const credentials = JSON.parse(
  fs.readFileSync(new URL("../creds.json", import.meta.url))
);

const { client_secret, client_id, redirect_uris } = credentials.web;

// ✅ Create OAuth client
const oAuth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uris[0]
);

// ✅ Define required Google Fit scopes
const SCOPES = [
  "https://www.googleapis.com/auth/fitness.activity.read",
  "https://www.googleapis.com/auth/fitness.blood_glucose.read",
  "https://www.googleapis.com/auth/fitness.blood_pressure.read",
  "https://www.googleapis.com/auth/fitness.heart_rate.read",
  "https://www.googleapis.com/auth/fitness.body.read",
  "https://www.googleapis.com/auth/fitness.sleep.read",
  "https://www.googleapis.com/auth/fitness.reproductive_health.read",
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/userinfo.email",
];

// ✅ Step 1: Generate Google Auth URL
const getGoogleAuthUrl = (req, res) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  res.json({ authUrl });
};

// ✅ Helper: Fetch user profile from Google
const getUserProfile = async (auth) => {
  const oauth2 = google.oauth2({ version: "v2", auth });
  const { data } = await oauth2.userinfo.get();
  return {
    displayName: data.name,
    profilePhotoUrl: data.picture,
    googleId: data.id,
  };
};

// ✅ Step 2: Handle Google OAuth2 callback
const handleGoogleCallback = async (req, res) => {
  const { code } = req.query;
  if (!code) {
    return res.status(400).json({ error: "No authorization code received" });
  }

  try {
    // Exchange code for tokens
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    // ✅ Fetch user profile
    const profile = await getUserProfile(oAuth2Client);

    // ✅ Save or update user in MongoDB
    let user = await User.findOne({ googleId: profile.googleId });
    if (!user) {
      user = await User.create({
        name: profile.displayName,
        googleId: profile.googleId,
        profilePhoto: profile.profilePhotoUrl,
      });
    }

    // ✅ Save session data
    if (req.session) {
      req.session.userProfile = {
        displayName: profile.displayName,
        profilePhotoUrl: profile.profilePhotoUrl,
        userID: profile.googleId,
      };
      req.session.tokens = tokens;
      await new Promise((resolve) => req.session.save(resolve)); // Ensure session is saved
    }

    // ✅ Optionally store token in cookie as backup
    res.cookie("googleFitTokens", tokens, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    });

    // ✅ Redirect to frontend dashboard
    res.redirect("http://localhost:5173/dashboard");
  } catch (error) {
    console.error("❌ Error during OAuth callback:", error);
    res.redirect("http://localhost:5173/error");
  }
};

// Fetch fitness data from Google Fit
const fetchFitnessData = async (req, res) => {
  try {
    // Get Google Fit tokens from session or cookie
    const googleTokens = req.session?.tokens || req.cookies?.googleFitTokens;

    if (!googleTokens) {
      return res
        .status(403)
        .json({ message: "Please connect your Google Fit account first" });
    }

    // Set the tokens for this request
    oAuth2Client.setCredentials(googleTokens);

    const fitness = google.fitness({ version: "v1", auth: oAuth2Client });

    // Get the user from JWT token (handled by your auth middleware)
    const user = req.user; // This comes from your JWT auth middleware

    if (!user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Validate that user has connected Google Fit
    const dbUser = await User.findById(user._id);
    if (!dbUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const sevenDaysInMillis = 14 * 24 * 60 * 60 * 1000;
    const startTimeMillis = Date.now() - sevenDaysInMillis;
    const endTimeMillis = Date.now() + 24 * 60 * 60 * 1000;

    const response = await fitness.users.dataset.aggregate({
      userId: "me",
      requestBody: {
        aggregateBy: [
          { dataTypeName: "com.google.step_count.delta" },
          { dataTypeName: "com.google.blood_glucose" },
          { dataTypeName: "com.google.blood_pressure" },
          { dataTypeName: "com.google.heart_rate.bpm" },
          { dataTypeName: "com.google.weight" },
          { dataTypeName: "com.google.height" },
          { dataTypeName: "com.google.sleep.segment" },
          { dataTypeName: "com.google.body.fat.percentage" },
          { dataTypeName: "com.google.menstruation" },
        ],
        bucketByTime: { durationMillis: 86400000 },
        startTimeMillis,
        endTimeMillis,
      },
    });

    const fitnessData = response.data.bucket;
    const formattedData = [];

    for (const data of fitnessData) {
      const date = new Date(parseInt(data.startTimeMillis));
      const formattedEntry = {
        date: date,
        step_count: 0,
        glucose_level: 0,
        blood_pressure: [],
        heart_rate: 0,
        weight: 0,
        height_in_cms: 0,
        sleep_hours: 0,
        body_fat_in_percent: 0,
        menstrual_cycle_start: "",
      };

      // Process fitness data...
      data.dataset.forEach(async (dataset) => {
        if (dataset.point && dataset.point.length > 0) {
          const point = dataset.point[0];
          const value = point.value;

          switch (dataset.dataSourceId) {
            case "derived:com.google.step_count.delta:com.google.android.gms:aggregated":
              formattedEntry.step_count = value[0]?.intVal || 0;
              break;
            case "derived:com.google.blood_glucose.summary:com.google.android.gms:aggregated":
              let glucoseLevel = 0;
              if (point[0]?.value) {
                point[0].value.forEach((data) => {
                  if (data.fpVal) {
                    glucoseLevel = data.fpVal * 10;
                  }
                });
              }
              formattedEntry.glucose_level = glucoseLevel;
              break;
            case "derived:com.google.blood_pressure.summary:com.google.android.gms:aggregated":
              let finalData = [0, 0];
              if (point[0]?.value) {
                point[0].value.forEach((data) => {
                  if (data.fpVal) {
                    if (data.fpVal > 100) {
                      finalData[0] = data.fpVal;
                    } else if (data.fpVal < 100) {
                      finalData[1] = data.fpVal;
                    }
                  }
                });
              }
              formattedEntry.blood_pressure = finalData;
              break;
            case "derived:com.google.heart_rate.summary:com.google.android.gms:aggregated":
              let heartData = 0;
              if (point[0]?.value) {
                point[0].value.forEach((data) => {
                  if (data.fpVal) {
                    heartData = data.fpVal;
                  }
                });
              }
              formattedEntry.heart_rate = heartData;
              break;
            case "derived:com.google.weight.summary:com.google.android.gms:aggregated":
              formattedEntry.weight = value[0]?.fpVal || 0;
              break;
            case "derived:com.google.height.summary:com.google.android.gms:aggregated":
              formattedEntry.height_in_cms = value[0]?.fpVal * 100 || 0;
              break;
            case "derived:com.google.sleep.segment:com.google.android.gms:merged":
              let sleepMillis = 0;
              point.forEach((sleepPoint) => {
                const type = sleepPoint.value[0].intVal;
                if ([2, 3, 4, 6].includes(type)) {
                  const durationNanos =
                    sleepPoint.endTimeNanos - sleepPoint.startTimeNanos;
                  sleepMillis += durationNanos / 1_000_000;
                }
              });
              formattedEntry.sleep_hours = sleepMillis / 3600_000 || 0;
              break;
            case "derived:com.google.body.fat.percentage.summary:com.google.android.gms:aggregated":
              let bodyFat = 0;
              if (point[0]?.value && point[0].value.length > 0) {
                bodyFat = point[0].value[0].fpVal;
              }
              formattedEntry.body_fat_in_percent = bodyFat;
              break;
            case "derived:com.google.menstruation:com.google.android.gms:aggregated":
              formattedEntry.menstrual_cycle_start =
                point[0]?.value[0]?.intVal || 0;
              break;
            default:
              break;
          }
        }
      });

      formattedData.push(formattedEntry);

      // Save to MongoDB
      await Fitness.findOneAndUpdate(
        { user: user._id, date: formattedEntry.date },
        {
          user: user._id,
          stepCount: formattedEntry.step_count,
          glucoseLevel: formattedEntry.glucose_level,
          bloodPressure: formattedEntry.blood_pressure,
          heartRate: formattedEntry.heart_rate,
          weight: formattedEntry.weight,
          heightInCms: formattedEntry.height_in_cms,
          sleepHours: formattedEntry.sleep_hours,
          bodyFatPercentage: formattedEntry.body_fat_in_percent,
          menstrualCycleStart: formattedEntry.menstrual_cycle_start,
        },
        { upsert: true, new: true }
      );
    }

    res.json({
      userName: user.name,
      profilePhoto: user.profilePhoto,
      userId: user._id,
      formattedData,
    });
  } catch (error) {
    console.error("Error fetching fitness data:", error);
    res.status(500).json({ message: "Error fetching fitness data" });
  }
};

export { getGoogleAuthUrl, handleGoogleCallback, fetchFitnessData };
