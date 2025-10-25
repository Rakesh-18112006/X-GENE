import { google } from "googleapis";
import User from "../models/userModel.js";
import Fitness from "../models/fitnessModel.js";
import fs from "fs";

const credentials = JSON.parse(
  fs.readFileSync(new URL("../creds.json", import.meta.url))
);

const { client_secret, client_id, redirect_uris } = credentials.web;
const oAuth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uris[0]
);

const SCOPES = [
  "https://www.googleapis.com/auth/fitness.activity.read",
  "https://www.googleapis.com/auth/fitness.blood_glucose.read",
  "https://www.googleapis.com/auth/fitness.blood_pressure.read",
  "https://www.googleapis.com/auth/fitness.heart_rate.read",
  "https://www.googleapis.com/auth/fitness.body.read",
  "https://www.googleapis.com/auth/fitness.sleep.read",
  "https://www.googleapis.com/auth/fitness.reproductive_health.read",
  "https://www.googleapis.com/auth/userinfo.profile",
];

// Get Google Auth URL
const getGoogleAuthUrl = (req, res) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  res.json({ authUrl });
};

// Get user profile from Google
const getUserProfile = async (auth) => {
  const service = google.people({ version: "v1", auth });
  const profile = await service.people.get({
    resourceName: "people/me",
    personFields: "names,photos,emailAddresses",
  });

  const displayName = profile.data.names[0].displayName;
  const url = profile.data.photos[0].url;
  let userID = profile.data.resourceName;
  userID = parseInt(userID.replace("people/", ""), 10);
  return {
    displayName,
    profilePhotoUrl: url,
    userID,
  };
};

// Handle Google OAuth callback
const handleGoogleCallback = async (req, res) => {
  const { code } = req.query;

  try {
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);
    req.session.tokens = tokens;

    const profile = await getUserProfile(oAuth2Client);
    req.session.userProfile = profile;

    // Save or update user in MongoDB
    let user = await User.findOne({ googleId: profile.userID });
    if (!user) {
      user = await User.create({
        name: profile.displayName,
        googleId: profile.userID,
        profilePhoto: profile.profilePhotoUrl,
      });
    }

    res.redirect("http://localhost:3000/dashboard");
  } catch (error) {
    console.error("Error retrieving access token:", error);
    res.redirect("/error");
  }
};

// Fetch fitness data from Google Fit
const fetchFitnessData = async (req, res) => {
  try {
    const fitness = google.fitness({ version: "v1", auth: oAuth2Client });
    const userProfile = req.session.userProfile;

    if (!userProfile) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const user = await User.findOne({ googleId: userProfile.userID });
    if (!user) {
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
            // ... (other cases remain the same)
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
      userName: userProfile.displayName,
      profilePhoto: userProfile.profilePhotoUrl,
      userId: userProfile.userID,
      formattedData,
    });
  } catch (error) {
    console.error("Error fetching fitness data:", error);
    res.status(500).json({ message: "Error fetching fitness data" });
  }
};

export { getGoogleAuthUrl, handleGoogleCallback, fetchFitnessData };
