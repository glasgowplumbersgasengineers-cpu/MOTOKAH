import { toPng, toSvg } from 'html-to-image';

export interface ExportOptions {
  filename: string;
  scale?: number;
  backgroundColor?: string;
}

export const exportToPng = async (
  element: HTMLElement,
  options: ExportOptions
): Promise<void> => {
  try {
    const bgColor = options.backgroundColor || '#0066CC';

    const dataUrl = await toPng(element, {
      quality: 1,
      pixelRatio: options.scale || 3,
      backgroundColor: bgColor,
      style: {
        backgroundColor: bgColor,
      },
      cacheBust: true,
    });

    const link = document.createElement('a');
    link.download = `${options.filename}.png`;
    link.href = dataUrl;
    link.click();
  } catch (error) {
    console.error('Error exporting PNG:', error);
    throw error;
  }
};

export const exportToSvg = async (
  element: HTMLElement,
  options: ExportOptions
): Promise<void> => {
  try {
    const bgColor = options.backgroundColor || '#0066CC';

    const dataUrl = await toSvg(element, {
      backgroundColor: bgColor,
      style: {
        backgroundColor: bgColor,
      },
      cacheBust: true,
    });

    const link = document.createElement('a');
    link.download = `${options.filename}.svg`;
    link.href = dataUrl;
    link.click();
  } catch (error) {
    console.error('Error exporting SVG:', error);
    throw error;
  }
};

export const downloadAllFormats = async (
  element: HTMLElement,
  filename: string,
  backgroundColor?: string
): Promise<void> => {
  await exportToPng(element, { filename, backgroundColor });
  await exportToSvg(element, { filename, backgroundColor });
};
