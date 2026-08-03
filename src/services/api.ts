import { BirthRegistrationRecord } from '../types';

export async function fetchBirthRegistrationRecord(
  brn: string,
  dob: string
): Promise<BirthRegistrationRecord> {
  const cleanBrn = brn.trim();
  const cleanDob = dob.trim();

  // Validate BRN: must be 17 digits
  if (!/^\d{17}$/.test(cleanBrn)) {
    throw new Error('জন্ম নিবন্ধন নম্বরটি অবশ্যই ১৭ সংখ্যার হতে হবে (Birth Registration Number must be 17 digits)');
  }

  // Validate DOB: YYYY-MM-DD
  if (!/^\d{4}-\d{2}-\d{2}$/.test(cleanDob)) {
    throw new Error('সঠিক জন্ম তারিখ প্রদান করুন (YYYY-MM-DD)');
  }

  const endpoint = `/api/verify?brn=${encodeURIComponent(cleanBrn)}&dob=${encodeURIComponent(cleanDob)}`;

  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || 'তথ্য খুঁজে পাওয়া যায়নি। অনুগ্রহ করে জন্ম নিবন্ধন নম্বর ও জন্ম তারিখ যাচাই করে আবার চেষ্টা করুন।');
    }

    return data as BirthRegistrationRecord;
  } catch (err: any) {
    if (err.name === 'AbortError') {
      throw new Error('সার্ভার থেকে তথ্য আসতে অতিরিক্ত সময় লাগছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।');
    }
    throw new Error(err.message || 'একটি অনাকাঙ্ক্ষিত নেটওয়ার্ক ত্রুটি ঘটেছে।');
  }
}
