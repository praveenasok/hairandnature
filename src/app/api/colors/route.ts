import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { SPECTRUM_COLORS, HairColor } from '@/data/colors';

const customColorsFilePath = path.join(process.cwd(), 'src/data/custom-colors.json');
const pricesFilePath = path.join(process.cwd(), 'src/data/prices.json');
const metadataFilePath = path.join(process.cwd(), 'src/data/product-metadata.json');

function readJsonFile<T>(filePath: string, fallback: T): T {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(content) as T;
    }
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
  }
  return fallback;
}

function writeJsonFile(filePath: string, data: any): void {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
  }
}

function getColorsWithOverrides(customNames: Record<string, string>): HairColor[] {
  return SPECTRUM_COLORS.map(c => ({
    ...c,
    name: customNames[c.id] || customNames[c.name] || c.name
  }));
}

export async function GET() {
  try {
    const customNames = readJsonFile<Record<string, string>>(customColorsFilePath, {});
    const colors = getColorsWithOverrides(customNames);
    return NextResponse.json({
      success: true,
      customNames,
      colors,
      defaultColors: SPECTRUM_COLORS
    });
  } catch (error) {
    console.error('Error fetching colors:', error);
    return NextResponse.json({
      success: false,
      customNames: {},
      colors: SPECTRUM_COLORS,
      defaultColors: SPECTRUM_COLORS
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const currentCustomNames = readJsonFile<Record<string, string>>(customColorsFilePath, {});
    const prices = readJsonFile<Record<string, number>>(pricesFilePath, {});
    const metadata = readJsonFile<Record<string, any>>(metadataFilePath, {});

    // Case 1: Reset All to default
    if (body.resetAll === true) {
      // Revert all custom names back to default in prices and metadata
      const renames: { oldName: string; newName: string }[] = [];
      for (const color of SPECTRUM_COLORS) {
        const customName = currentCustomNames[color.id] || currentCustomNames[color.name];
        if (customName && customName !== color.name) {
          renames.push({ oldName: customName, newName: color.name });
        }
      }

      const updatedPrices = { ...prices };
      const updatedMetadata = { ...metadata };

      for (const { oldName, newName } of renames) {
        // Migrate prices
        for (const [key, val] of Object.entries(updatedPrices)) {
          const parts = key.split('|');
          if (parts[3] === oldName) {
            parts[3] = newName;
            delete updatedPrices[key];
            updatedPrices[parts.join('|')] = val;
          }
        }
        // Migrate product metadata
        for (const prodKey of Object.keys(updatedMetadata)) {
          const prod = updatedMetadata[prodKey];
          if (prod && Array.isArray(prod.availableColors)) {
            prod.availableColors = prod.availableColors.map((cName: string) => cName === oldName ? newName : cName);
          }
        }
      }

      writeJsonFile(customColorsFilePath, {});
      if (renames.length > 0) {
        writeJsonFile(pricesFilePath, updatedPrices);
        writeJsonFile(metadataFilePath, updatedMetadata);
      }

      return NextResponse.json({
        success: true,
        message: 'All colors reset to defaults successfully',
        customNames: {},
        colors: SPECTRUM_COLORS
      });
    }

    // Case 2: Update custom names map
    let incomingMap: Record<string, string> = {};
    if (body.customNames && typeof body.customNames === 'object') {
      incomingMap = body.customNames;
    } else if (body.id && typeof body.name === 'string') {
      incomingMap = { ...currentCustomNames, [body.id]: body.name.trim() };
    } else {
      return NextResponse.json({ error: 'Invalid payload: provide customNames object or id & name' }, { status: 400 });
    }

    // Build new custom names map and detect renames
    const newCustomNames: Record<string, string> = {};
    const renames: { oldName: string; newName: string }[] = [];

    for (const color of SPECTRUM_COLORS) {
      const currentName = currentCustomNames[color.id] || currentCustomNames[color.name] || color.name;
      const requestedName = incomingMap[color.id] !== undefined ? incomingMap[color.id].trim() : (incomingMap[color.name]?.trim() ?? currentCustomNames[color.id]);

      if (requestedName && requestedName !== color.name) {
        newCustomNames[color.id] = requestedName;
      }

      const effectiveNewName = (requestedName && requestedName.length > 0) ? requestedName : color.name;
      if (currentName !== effectiveNewName) {
        renames.push({ oldName: currentName, newName: effectiveNewName });
      }
    }

    // Update prices & metadata for all renames
    const updatedPrices = { ...prices };
    const updatedMetadata = { ...metadata };
    let priceMigratedCount = 0;
    let metadataMigratedCount = 0;

    for (const { oldName, newName } of renames) {
      // Migrate prices
      for (const [key, val] of Object.entries(updatedPrices)) {
        const parts = key.split('|');
        if (parts[3] === oldName) {
          parts[3] = newName;
          delete updatedPrices[key];
          updatedPrices[parts.join('|')] = val;
          priceMigratedCount++;
        }
      }
      // Migrate product metadata
      for (const prodKey of Object.keys(updatedMetadata)) {
        const prod = updatedMetadata[prodKey];
        if (prod && Array.isArray(prod.availableColors)) {
          const hadOld = prod.availableColors.includes(oldName);
          if (hadOld) {
            prod.availableColors = prod.availableColors.map((cName: string) => cName === oldName ? newName : cName);
            metadataMigratedCount++;
          }
        }
      }
    }

    writeJsonFile(customColorsFilePath, newCustomNames);
    if (renames.length > 0) {
      writeJsonFile(pricesFilePath, updatedPrices);
      writeJsonFile(metadataFilePath, updatedMetadata);
    }

    const updatedColors = getColorsWithOverrides(newCustomNames);

    return NextResponse.json({
      success: true,
      customNames: newCustomNames,
      colors: updatedColors,
      renamesCount: renames.length,
      priceMigratedCount,
      metadataMigratedCount
    });
  } catch (error) {
    console.error('Error saving colors:', error);
    return NextResponse.json({ error: 'Failed to save color customizations' }, { status: 500 });
  }
}
