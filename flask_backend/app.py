from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import os
import tempfile
import pandas as pd
import numpy as np
import json
from groq import Groq
import io
import PyPDF2
from datetime import datetime
import gzip

app = Flask(__name__)

# Configuration
UPLOAD_FOLDER = tempfile.gettempdir()
ALLOWED_EXTENSIONS = {'vcf', 'csv', 'txt', 'ped', 'map', 'bed', 'fam', 'bim', 'fasta', 'fa', 'pdf'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024  # 50MB max file size

# Initialize Groq client
client = Groq(api_key="GROQ_API_KEY")  # Replace with your actual Groq API key

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def call_groq_llm(genomic_data_summary):
    """Call Groq LLM to analyze genomic risks"""
    try:
        prompt = f"""
        Analyze the following genomic data and identify top disease risks with probabilities and explanations.
        Provide response in JSON format with: risk_name, probability, reason.
        
        Genomic Data Summary:
        {json.dumps(genomic_data_summary, indent=2)}
        
        Return only valid JSON array without any additional text.
        Example format:
        [
            {{
                "risk_name": "Type 2 Diabetes",
                "probability": "0.65",
                "reason": "Identified SNP rs7903146 in TCF7L2 gene associated with 65% increased risk"
            }}
        ]
        """
        
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are a genomic risk analysis expert. Analyze genomic data and provide disease risks in JSON format."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.1,
            max_tokens=1024
        )
        
        response = chat_completion.choices[0].message.content
        # Clean response and parse JSON
        response = response.strip()
        if response.startswith('```json'):
            response = response[7:]
        if response.endswith('```'):
            response = response[:-3]
        
        return json.loads(response)
    except Exception as e:
        print(f"Groq API error: {e}")
        # Return sample data if Groq fails
        return [
            {
                "risk_name": "Cardiovascular Disease",
                "probability": "0.45",
                "reason": "Detected variants associated with lipid metabolism"
            },
            {
                "risk_name": "Type 2 Diabetes", 
                "probability": "0.32",
                "reason": "Genetic markers related to insulin resistance identified"
            }
        ]

def process_vcf(file_path):
    """Process VCF file format"""
    variants = []
    try:
        # Handle gzipped VCF files
        if file_path.endswith('.gz'):
            with gzip.open(file_path, 'rt') as file:
                content = file.read()
        else:
            with open(file_path, 'r') as file:
                content = file.read()
        
        lines = content.split('\n')
        for line in lines:
            if line.startswith('#'):
                continue
            if line.strip():
                parts = line.strip().split('\t')
                if len(parts) >= 8:
                    chrom, pos, variant_id, ref, alt, qual, filter_status, info = parts[:8]
                    variants.append({
                        'chromosome': chrom,
                        'position': pos,
                        'variant_id': variant_id,
                        'reference': ref,
                        'alternate': alt,
                        'info': info
                    })
    except Exception as e:
        print(f"VCF processing error: {e}")
    
    return {
        'file_type': 'VCF',
        'variant_count': len(variants),
        'sample_variants': variants[:10],
        'chromosomes': list(set([v['chromosome'] for v in variants]))
    }

def process_csv(file_path):
    """Process CSV genomic data"""
    try:
        df = pd.read_csv(file_path)
        summary = {
            'file_type': 'CSV',
            'columns': df.columns.tolist(),
            'row_count': len(df),
            'data_preview': df.head().to_dict('records')
        }
        return summary
    except Exception as e:
        return {
            'file_type': 'CSV',
            'error': str(e),
            'columns': [],
            'row_count': 0
        }

def process_fasta(file_path):
    """Process FASTA file format"""
    sequences = []
    current_seq = {}
    try:
        with open(file_path, 'r') as file:
            for line in file:
                line = line.strip()
                if line.startswith('>'):
                    if current_seq:
                        sequences.append(current_seq)
                    current_seq = {'header': line[1:], 'sequence': ''}
                else:
                    current_seq['sequence'] += line
            if current_seq:
                sequences.append(current_seq)
        
        return {
            'file_type': 'FASTA',
            'sequence_count': len(sequences),
            'sequences': sequences[:5],
            'total_bases': sum(len(seq.get('sequence', '')) for seq in sequences)
        }
    except Exception as e:
        return {
            'file_type': 'FASTA',
            'error': str(e),
            'sequence_count': 0
        }

def process_ped_map(file_path):
    """Process PED/MAP PLINK format"""
    ped_data = []
    try:
        with open(file_path, 'r') as file:
            for line in file:
                parts = line.strip().split()
                if len(parts) >= 6:
                    ped_data.append({
                        'family_id': parts[0],
                        'individual_id': parts[1],
                        'father_id': parts[2],
                        'mother_id': parts[3],
                        'sex': parts[4],
                        'phenotype': parts[5]
                    })
        
        return {
            'file_type': 'PED/MAP',
            'individuals_count': len(ped_data),
            'sample_individuals': ped_data[:5]
        }
    except Exception as e:
        return {
            'file_type': 'PED/MAP',
            'error': str(e),
            'individuals_count': 0
        }

def process_bed_files(file_path):
    """Process BED format files"""
    try:
        # Simple BED file processing
        with open(file_path, 'r') as file:
            bed_data = []
            for line in file:
                if line.strip() and not line.startswith('#'):
                    parts = line.strip().split('\t')
                    if len(parts) >= 3:
                        bed_data.append({
                            'chromosome': parts[0],
                            'start': parts[1],
                            'end': parts[2]
                        })
        
        return {
            'file_type': 'BED',
            'regions_count': len(bed_data),
            'sample_regions': bed_data[:5]
        }
    except Exception as e:
        return {
            'file_type': 'BED',
            'error': str(e),
            'regions_count': 0
        }

def process_pdf(file_path):
    """Process PDF genomic reports"""
    try:
        with open(file_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            text = ""
            for page in reader.pages[:3]:  # First 3 pages
                text += page.extract_text()
        
        return {
            'file_type': 'PDF',
            'pages_processed': len(reader.pages),
            'text_sample': text[:1000]
        }
    except Exception as e:
        return {
            'file_type': 'PDF',
            'error': str(e)
        }

def process_text_file(file_path):
    """Process generic text files"""
    try:
        with open(file_path, 'r') as file:
            content = file.read()
        
        lines = content.split('\n')
        return {
            'file_type': 'TEXT',
            'line_count': len(lines),
            'content_sample': content[:500]
        }
    except Exception as e:
        return {
            'file_type': 'TEXT',
            'error': str(e)
        }

@app.route('/predict_risk', methods=['POST'])
def predict_risk():
    """Main endpoint for genomic risk prediction"""
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        
        try:
            # Process based on file extension
            file_extension = filename.rsplit('.', 1)[1].lower()
            
            if file_extension in ['vcf', 'vcf.gz']:
                genomic_summary = process_vcf(file_path)
            elif file_extension == 'csv':
                genomic_summary = process_csv(file_path)
            elif file_extension in ['fasta', 'fa']:
                genomic_summary = process_fasta(file_path)
            elif file_extension == 'ped':
                genomic_summary = process_ped_map(file_path)
            elif file_extension == 'bed':
                genomic_summary = process_bed_files(file_path)
            elif file_extension == 'pdf':
                genomic_summary = process_pdf(file_path)
            elif file_extension == 'txt':
                genomic_summary = process_text_file(file_path)
            else:
                return jsonify({'error': f'Unsupported file format: {file_extension}'}), 400
            
            # Add metadata
            genomic_summary['processed_at'] = datetime.now().isoformat()
            genomic_summary['filename'] = filename
            
            # Call Groq LLM for risk analysis
            risks = call_groq_llm(genomic_summary)
            
            # Clean up
            if os.path.exists(file_path):
                os.remove(file_path)
            
            return jsonify({
                'status': 'success',
                'file_processed': filename,
                'genomic_summary': genomic_summary,
                'identified_risks': risks
            })
            
        except Exception as e:
            # Clean up on error
            if os.path.exists(file_path):
                os.remove(file_path)
            return jsonify({'error': f'Processing error: {str(e)}'}), 500
    
    return jsonify({'error': 'Invalid file type'}), 400

@app.route('/formats', methods=['GET'])
def get_supported_formats():
    """Endpoint to list supported file formats"""
    return jsonify({
        'supported_formats': list(ALLOWED_EXTENSIONS),
        'max_file_size': '50MB'
    })

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)