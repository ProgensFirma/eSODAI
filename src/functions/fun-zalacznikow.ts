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