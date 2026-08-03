import type { Request, Response } from 'express';

export async function handleVerifyRequest(brn: string, dob: string) {
  // Validate inputs
  const cleanBrn = (brn || '').trim();
  const cleanDob = (dob || '').trim();

  if (!cleanBrn || !/^\d{17}$/.test(cleanBrn)) {
    return {
      status: 400,
      success: false,
      error: '১৭ ডিজিটের সঠিক জন্ম নিবন্ধন নম্বর দিন (Birth Registration Number must be 17 digits).'
    };
  }

  if (!cleanDob || !/^\d{4}-\d{2}-\d{2}$/.test(cleanDob)) {
    return {
      status: 400,
      success: false,
      error: 'সঠিক জন্ম তারিখ দিন (YYYY-MM-DD).'
    };
  }

  const upstreamBase = process.env.BIRTH_REG_API_URL || 'https://sbsakib.eu.cc/api/bard';
  const targetUrl = `${upstreamBase}?brn=${encodeURIComponent(cleanBrn)}&dob=${encodeURIComponent(cleanDob)}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 9000);

  try {
    const upstreamRes = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json'
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (upstreamRes.ok) {
      const data = await upstreamRes.json();
      if (data && (data.success || data.brn || data.nameBangla)) {
        return {
          status: 200,
          success: true,
          ...data,
          verifiedAt: new Date().toISOString()
        };
      }
    }
    
    // If upstream API returned non-OK status or custom error object
    const text = await upstreamRes.text().catch(() => '');
    try {
      const parsed = JSON.parse(text);
      if (parsed && parsed.message) {
        return {
          status: 404,
          success: false,
          error: parsed.message || 'প্রদত্ত জন্ম নিবন্ধন নম্বর বা জন্ম তারিখ অনুযায়ী কোনো তথ্য পাওয়া যায়নি।'
        };
      }
    } catch {
      // ignore JSON parse error
    }

    return {
      status: 404,
      success: false,
      error: 'প্রদত্ত জন্ম নিবন্ধন নম্বর বা জন্ম তারিখটি ডাটাবেজে পাওয়া যায়নি। অনুগ্রহ করে সঠিক তথ্য প্রদান করুন।'
    };
  } catch (err: any) {
    clearTimeout(timeoutId);
    
    // Fallback error messaging
    if (err.name === 'AbortError') {
      return {
        status: 504,
        success: false,
        error: 'সার্ভার রেসপন্স করতে অতিরিক্ত সময় নিচ্ছে। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।'
      };
    }

    return {
      status: 502,
      success: false,
      error: 'নেটওয়ার্ক কানেকশন সমস্যা অথবা সার্ভার অনলাইন নেই। অনুগ্রহ করে পুনরায় চেষ্টা করুন।'
    };
  }
}

// Vercel Serverless API Route Handler
export default async function handler(req: any, res: any) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const brn = (req.query?.brn || req.body?.brn || '') as string;
  const dob = (req.query?.dob || req.body?.dob || '') as string;

  const result = await handleVerifyRequest(brn, dob);
  return res.status(result.status || 200).json(result);
}
