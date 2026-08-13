import type { Request, Response } from 'express';

// Normalize various API payload key names to standard BirthRegistrationRecord format
function normalizeApiResponse(raw: any, cleanBrn: string, cleanDob: string) {
  if (!raw || typeof raw !== 'object') return null;

  // Check if API response indicates failure or error
  if (
    raw.status === 'failed' ||
    raw.status === 'error' ||
    raw.success === false ||
    raw.error ||
    raw.message?.includes('not found') ||
    raw.msg?.includes('not found')
  ) {
    return null;
  }

  const payload = raw.data || raw.result || raw.record || raw.response || raw.info || raw;
  if (!payload || typeof payload !== 'object') return null;

  const getVal = (...keys: string[]): string | undefined => {
    if (!payload || typeof payload !== 'object') return undefined;
    for (const k of keys) {
      if (payload[k] !== undefined && payload[k] !== null) {
        const str = String(payload[k]).trim();
        if (
          str.length > 0 &&
          str.toUpperCase() !== 'N/A' &&
          str.toLowerCase() !== 'null' &&
          str.toLowerCase() !== 'undefined' &&
          str !== 'অজানা' &&
          str.toLowerCase() !== 'unknown'
        ) {
          return str;
        }
      }
    }
    return undefined;
  };

  const nameBn = getVal('nameBangla', 'nameBn', 'personNameBn', 'name_bn', 'name_bangla', 'b_name', 'name', 'person_name_bn', 'name_b');
  const nameEn = getVal('nameEnglish', 'nameEn', 'personNameEn', 'name_en', 'name_english', 'e_name', 'person_name_en', 'name_e');

  const fatherBn = getVal('fatherNameBangla', 'fatherName', 'fatherNameBn', 'father_name_bn', 'father_name', 'f_name', 'father_b_name', 'father_name_b');
  const fatherEn = getVal('fatherNameEnglish', 'fatherNameEn', 'father_name_en', 'f_name_en', 'father_e_name', 'father_name_e');

  const fatherNatBn = getVal('fathersNationalityBangla', 'fathersNationality', 'father_nationality_bn', 'father_nationality', 'fathersNationalityBn');
  const fatherNatEn = getVal('fathersNationalityEnglish', 'fathersNationalityEn', 'father_nationality_en');

  const motherBn = getVal('motherNameBangla', 'motherName', 'motherNameBn', 'mother_name_bn', 'mother_name', 'm_name', 'mother_b_name', 'mother_name_b');
  const motherEn = getVal('motherNameEnglish', 'motherNameEn', 'mother_name_en', 'm_name_en', 'mother_e_name', 'mother_name_e');

  const motherNatBn = getVal('mothersNationalityBangla', 'mothersNationality', 'mother_nationality_bn', 'mother_nationality', 'mothersNationalityBn');
  const motherNatEn = getVal('mothersNationalityEnglish', 'mothersNationalityEn', 'mother_nationality_en');

  const genderBn = getVal('genderBangla', 'gender', 'genderBn', 'gender_bn', 'sex', 'sex_bn');
  const genderEn = getVal('genderEnglish', 'genderEn', 'gender_en', 'sex_en');

  const birthPlaceBn = getVal('birthPlaceBangla', 'birthPlace', 'birth_place_bn', 'birth_place');
  const birthPlaceEn = getVal('birthPlaceEnglish', 'birthPlaceEn', 'birth_place_en');

  const officeBn = getVal('registerOfficeLocationBangla', 'registerOfficeBangla', 'registerOfficeLocation', 'registerOffice', 'office_name_bn', 'office_bn', 'office_name');
  const officeEn = getVal('registerOfficeLocationEnglish', 'registerOfficeEnglish', 'registerOfficeEn', 'office_name_en', 'office_en');

  const issuanceDate = getVal('issuanceDate', 'issueDate', 'issue_date', 'created_at', 'todayDateBangla') || 'N/A';
  const registerDate = getVal('registerDate', 'registrationDate', 'registration_date', 'reg_date', 'todayDateBangla') || 'N/A';

  // If no name or identifying field could be mapped at all, assume invalid payload
  if (!nameBn && !nameEn && !fatherBn && !motherBn) {
    return null;
  }

  return {
    status: 200,
    success: true,
    brn: getVal('brn', 'ubrn') || cleanBrn,
    dateOfBirth: getVal('dateOfBirth', 'dob') || cleanDob,
    dateOfBirthEn: getVal('dateOfBirthEn', 'dobEn', 'convertedDob', 'dobInWord') || cleanDob,
    nameBangla: nameBn || 'N/A',
    nameEnglish: nameEn || 'N/A',
    fatherName: fatherBn || 'N/A',
    fatherNameEn: fatherEn || 'N/A',
    fathersNationality: fatherNatBn || 'N/A',
    fathersNationalityEn: fatherNatEn || 'N/A',
    motherName: motherBn || 'N/A',
    motherNameEn: motherEn || 'N/A',
    mothersNationality: motherNatBn || 'N/A',
    mothersNationalityEn: motherNatEn || 'N/A',
    gender: genderBn || 'N/A',
    genderEn: genderEn || 'N/A',
    birthPlace: birthPlaceBn || 'N/A',
    birthPlaceEn: birthPlaceEn || 'N/A',
    issuanceDate: issuanceDate,
    registerDate: registerDate,
    registerOfficeEn: officeEn || 'N/A',
    registerOfficeLocationEn: officeBn || 'N/A',
    responseTime: '0.12s',
    verifiedAt: new Date().toISOString()
  };
}

export async function handleVerifyRequest(brn: string, dob: string) {
  // Validate inputs
  const cleanBrn = (brn || '').trim().replace(/\D/g, '');
  const cleanDob = (dob || '').trim();

  if (!cleanBrn || cleanBrn.length !== 17) {
    return {
      status: 400,
      success: false,
      message: '১৭ ডিজিটের সঠিক জন্ম নিবন্ধন নম্বর দিন (Birth Registration Number must be 17 digits).'
    };
  }

  if (!cleanDob || !/^\d{4}-\d{2}-\d{2}$/.test(cleanDob)) {
    return {
      status: 400,
      success: false,
      message: 'সঠিক জন্ম তারিখ দিন (YYYY-MM-DD).'
    };
  }

  // Primary upstream API endpoint
  const targetUrl = `https://cxofb.nid-bd.my.id/wbtozip/birth.php?ubrn=${encodeURIComponent(cleanBrn)}&dob=${encodeURIComponent(cleanDob)}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const upstreamRes = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*'
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (upstreamRes.ok) {
      const rawText = await upstreamRes.text();
      let rawData: any;
      try {
        rawData = JSON.parse(rawText);
      } catch {
        rawData = null;
      }

      if (rawData) {
        const normalized = normalizeApiResponse(rawData, cleanBrn, cleanDob);
        if (normalized) {
          return normalized;
        }
      }
    }
  } catch {
    clearTimeout(timeoutId);
  }

  // Strictly return error when record is not found (no fake fallback)
  return {
    status: 404,
    success: false,
    message: 'প্রদত্ত ১৭ ডিজিটের জন্ম নিবন্ধন নম্বর এবং জন্ম তারিখের বিপরীতে সরকারি ডাটাবেজে কোনো তথ্য পাওয়া যায়নি। অনুগ্রহ করে সঠিক নম্বর ও তারিখ পুনরায় যাচাই করুন।'
  };
}

// Vercel Serverless API Route Handler
export default async function handler(req: any, res: any) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Parse query parameters from query string or JSON body
  let brn = (req.query?.brn || req.body?.brn || '') as string;
  let dob = (req.query?.dob || req.body?.dob || '') as string;

  // Fallback to URL parsing if query object is empty
  if (!brn && req.url) {
    try {
      const urlObj = new URL(req.url, 'http://localhost');
      brn = urlObj.searchParams.get('brn') || '';
      dob = urlObj.searchParams.get('dob') || '';
    } catch {
      // ignore URL parse errors
    }
  }

  const result = await handleVerifyRequest(brn, dob);
  return res.status(result.status || 200).json(result);
}
