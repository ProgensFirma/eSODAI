export interface PodpisInfo {
  czyPodpisany: boolean;
  podpisujacy?: string;
  dataPodpisu?: string;
  typPodpisu?: string;
  liczbaPodpisow?: number;
  komunikat?: string;
}

export function sprawdzPodpis(filename: string, base64Content: string): PodpisInfo {
  if (!filename || !base64Content) {
    return { czyPodpisany: false, komunikat: 'Brak pliku lub zawartości' };
  }

  const bytes = Uint8Array.from(atob(base64Content), c => c.charCodeAt(0));
  const ext = filename.split('.').pop()?.toLowerCase();

  if (ext === 'pdf') {
    return sprawdzPodpisPdf(bytes);
  } else if (ext === 'xml') {
    return sprawdzPodpisXml(bytes);
  }

  return { czyPodpisany: false, komunikat: 'Sprawdzanie podpisu obsługiwane tylko dla PDF i XML' };
}

function sprawdzPodpisPdf(bytes: Uint8Array): PodpisInfo {
  const text = new TextDecoder('latin1').decode(bytes);

  const byteRanges: { start: number; end: number }[] = [];
  const brRegex = /\/ByteRange\s*\[\s*(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s*\]/g;
  let m: RegExpExecArray | null;
  while ((m = brRegex.exec(text)) !== null) {
    byteRanges.push({ start: parseInt(m[2], 10), end: parseInt(m[3], 10) });
  }

  if (byteRanges.length === 0) {
    return { czyPodpisany: false, komunikat: 'Brak podpisu cyfrowego w PDF' };
  }

  let typPodpisu = 'PKCS#7/PDF';
  if (/PAdES|pades/i.test(text)) typPodpisu = 'PAdES';

  const firstRange = byteRanges[0];
  const cn = extractCNFromPkcs7(bytes, firstRange.start, firstRange.end);
  const signingTime = extractSigningTimeFromPkcs7(bytes, firstRange.start, firstRange.end);

  let pdfDate: string | null = null;
  const mDate = text.match(/\/M\s*\(D:(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/);
  if (mDate) {
    pdfDate = `${mDate[1]}-${mDate[2]}-${mDate[3]} ${mDate[4]}:${mDate[5]}:${mDate[6]}`;
  }

  const finalTime = signingTime ?? pdfDate ?? undefined;
  const finalName = cn ?? undefined;

  return {
    czyPodpisany: true,
    podpisujacy: finalName,
    dataPodpisu: finalTime,
    typPodpisu,
    liczbaPodpisow: byteRanges.length,
    komunikat: finalName
      ? `Podpisany przez: ${finalName}${finalTime ? ', data: ' + finalTime : ''}`
      : 'Plik jest podpisany cyfrowo (nie udało się odczytać danych podpisującego)',
  };
}

function sprawdzPodpisXml(bytes: Uint8Array): PodpisInfo {
  const text = new TextDecoder('utf-8').decode(bytes);

  if (!/<Signature[\s>]/i.test(text) && !/<\w+:Signature[\s>]/i.test(text)) {
    return { czyPodpisany: false, komunikat: 'Brak podpisu cyfrowego w XML' };
  }

  let typPodpisu = 'XMLDSig';
  if (/xades|XAdES/i.test(text)) typPodpisu = 'XAdES';

  const parser = new DOMParser();
  const doc = parser.parseFromString(text, 'application/xml');

  const signatures = doc.getElementsByTagNameNS('*', 'Signature');
  const certElements = doc.getElementsByTagNameNS('*', 'X509Certificate');
  const timeElements = doc.getElementsByTagNameNS('*', 'SigningTime');

  let podpisujacy: string | undefined;
  if (certElements.length > 0) {
    const certBase64 = certElements[0].textContent?.trim().replace(/\s+/g, '');
    if (certBase64) {
      const certBytes = Uint8Array.from(atob(certBase64), c => c.charCodeAt(0));
      podpisujacy = extractCNFromDer(certBytes) ?? undefined;
    }
  }

  let dataPodpisu: string | undefined;
  if (timeElements.length > 0) {
    dataPodpisu = timeElements[0].textContent?.trim();
  }

  return {
    czyPodpisany: true,
    podpisujacy,
    dataPodpisu,
    typPodpisu,
    liczbaPodpisow: signatures.length || 1,
    komunikat: podpisujacy
      ? `Podpisany przez: ${podpisujacy}${dataPodpisu ? ', data: ' + dataPodpisu : ''}`
      : 'Plik jest podpisany cyfrowo (nie udało się odczytać danych podpisującego)',
  };
}

function extractCNFromPkcs7(bytes: Uint8Array, rangeStart: number, rangeEnd: number): string | null {
  const slice = bytes.slice(rangeStart, rangeEnd);
  const text = new TextDecoder('latin1').decode(slice);

  const contentsMatch = text.match(/\/Contents\s*<([0-9A-Fa-f\s]*)>/i);
  if (!contentsMatch) return null;

  const hexStr = contentsMatch[1].replace(/\s/g, '');
  if (hexStr.length < 20) return null;

  const pkcs7Bytes = hexToBytes(hexStr);
  return extractCNFromDer(pkcs7Bytes);
}

function extractCNFromDer(bytes: Uint8Array): string | null {
  const oid = [0x06, 0x03, 0x55, 0x04, 0x03];
  const results: string[] = [];

  for (let i = 0; i <= bytes.length - oid.length; i++) {
    if (!bytesMatch(bytes, i, oid)) continue;

    const tag = bytes[i + oid.length];
    if (tag !== 0x13 && tag !== 0x0C && tag !== 0x16) continue;

    const lenOffset = i + oid.length + 1;
    if (lenOffset >= bytes.length) continue;
    let len = bytes[lenOffset];
    let valueOffset = lenOffset + 1;

    if (len & 0x80) {
      const numBytes = len & 0x7f;
      if (numBytes > 4 || lenOffset + 1 + numBytes > bytes.length) continue;
      len = 0;
      for (let j = 0; j < numBytes; j++) {
        len = (len << 8) | bytes[lenOffset + 1 + j];
      }
      valueOffset = lenOffset + 1 + numBytes;
    }

    if (valueOffset + len > bytes.length || len <= 0) continue;

    const value = new TextDecoder('utf-8').decode(bytes.slice(valueOffset, valueOffset + len));
    if (value && value.length > 1) {
      results.push(value);
    }
  }

  if (results.length === 0) return null;
  const person = results.find(cn => cn.includes(' ') && !/CA|Certificate|Authority|Root|Qualif/i.test(cn));
  return person ?? results[0];
}

function extractSigningTimeFromPkcs7(bytes: Uint8Array, rangeStart: number, rangeEnd: number): string | null {
  const slice = bytes.slice(rangeStart, rangeEnd);
  const text = new TextDecoder('latin1').decode(slice);

  const contentsMatch = text.match(/\/Contents\s*<([0-9A-Fa-f\s]*)>/i);
  if (!contentsMatch) return null;

  const hexStr = contentsMatch[1].replace(/\s/g, '');
  if (hexStr.length < 20) return null;

  const pkcs7Bytes = hexToBytes(hexStr);

  const oid = [0x06, 0x09, 0x2a, 0x86, 0x48, 0x86, 0xf7, 0x0d, 0x01, 0x09, 0x05];

  for (let i = 0; i <= pkcs7Bytes.length - oid.length; i++) {
    if (!bytesMatch(pkcs7Bytes, i, oid)) continue;

    let offset = i + oid.length;
    if (offset >= pkcs7Bytes.length) continue;
    if (pkcs7Bytes[offset] === 0x31) offset++;
    if (offset >= pkcs7Bytes.length) continue;

    const tag = pkcs7Bytes[offset];
    if (tag !== 0x17 && tag !== 0x18) continue;

    const len = pkcs7Bytes[offset + 1];
    if (len & 0x80 || offset + 2 + len > pkcs7Bytes.length) continue;

    const timeStr = new TextDecoder('ascii').decode(pkcs7Bytes.slice(offset + 2, offset + 2 + len));
    return parseAsn1Time(timeStr);
  }

  return null;
}

function parseAsn1Time(timeStr: string): string | null {
  let match = timeStr.match(/^(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/);
  if (match) {
    let year = parseInt(match[1], 10);
    year += year >= 50 ? 1900 : 2000;
    return `${year}-${match[2]}-${match[3]} ${match[4]}:${match[5]}:${match[6]}`;
  }

  match = timeStr.match(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/);
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]} ${match[4]}:${match[5]}:${match[6]}`;
  }

  return timeStr;
}

function hexToBytes(hex: string): Uint8Array {
  const cleanHex = hex.replace(/\s/g, '');
  const bytes = new Uint8Array(Math.floor(cleanHex.length / 2));
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(cleanHex.substr(i * 2, 2), 16);
  }
  return bytes;
}

function bytesMatch(bytes: Uint8Array, offset: number, pattern: number[]): boolean {
  if (offset + pattern.length > bytes.length) return false;
  for (let i = 0; i < pattern.length; i++) {
    if (bytes[offset + i] !== pattern[i]) return false;
  }
  return true;
}

export function openOrDownloadBase64File(filename: string, base64Content: string) {
  if (!filename || !base64Content) {
      return;
  }

  // 1. Zamiana Base64 na bajty
  const bytes = Uint8Array.from(atob(base64Content), c => c.charCodeAt(0));

  // 2. Określenie typu MIME na podstawie rozszerzenia
  const ext = filename.split('.').pop()?.toLowerCase();
  let mimeType = 'application/octet-stream'; // domyślny binarny

  switch (ext) {
    case 'pdf': mimeType = 'application/pdf'; break;
    case 'png': mimeType = 'image/png'; break;
    case 'jpg':
    case 'jpeg': mimeType = 'image/jpeg'; break;
    case 'gif': mimeType = 'image/gif'; break;
    case 'txt': mimeType = 'text/plain'; break;
    case 'csv': mimeType = 'text/csv'; break;
    // dodaj inne typy według potrzeby
  }

  // 3. Tworzymy Blob
  const blob = new Blob([bytes], { type: mimeType });
  const url = URL.createObjectURL(blob);

  // 4. Działanie w zależności od typu
  if (mimeType === 'application/pdf') {
    // otwórz PDF w nowej karcie
    window.open(url, '_blank');
  } else {
    // automatyczne pobranie dla pozostałych plików
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}