// A robust fallback CSV parser in case papaparse fails or isn't installed properly
const fallbackCSVParse = (text: string) => {
  const lines = text.split(/\r?\n/).filter(line => line.trim());
  if (lines.length === 0) return [];
  
  const headers = lines[0].split(',').map(h => h.trim());
  const data = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    const obj: any = {};
    headers.forEach((h, idx) => {
      obj[h] = values[idx] || '';
    });
    data.push(obj);
  }
  return { data, meta: { fields: headers } };
};

export const parseCSV = async (file: File): Promise<any> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result as string;
      try {
        // Try to load PapaParse dynamically from CDN to bypass npm install issues
        if (!(window as any).Papa) {
          await loadScript('https://unpkg.com/papaparse@5.4.1/papaparse.min.js');
        }
        
        if ((window as any).Papa) {
          (window as any).Papa.parse(text, {
            header: true,
            skipEmptyLines: true,
            complete: (results: any) => resolve(results)
          });
        } else {
          resolve(fallbackCSVParse(text));
        }
      } catch (err) {
        // Fallback if CDN blocked
        resolve(fallbackCSVParse(text));
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
};

export const parseExcel = async (file: File): Promise<any> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = e.target?.result;
      try {
        if (!(window as any).XLSX) {
          await loadScript('https://cdn.sheetjs.com/xlsx-0.20.1/package/dist/xlsx.full.min.js');
        }
        
        if ((window as any).XLSX) {
          const workbook = (window as any).XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const json = (window as any).XLSX.utils.sheet_to_json(worksheet);
          
          // Format like PapaParse for consistency
          if (json.length > 0) {
            resolve({ data: json, meta: { fields: Object.keys(json[0] as any) } });
          } else {
            resolve({ data: [], meta: { fields: [] } });
          }
        } else {
          reject(new Error("SheetJS failed to load."));
        }
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

// Utility to inject scripts
const loadScript = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Script load error for ${src}`));
    document.head.appendChild(script);
  });
};
