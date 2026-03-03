/**
 * SVG Generator using GeoPattern for Blog Card Cover Images
 * Creates beautiful, consistent geometric patterns based on post metadata
 */

import GeoPattern from 'geopattern';
import { Post } from './content/types';

export interface SVGGeneratorOptions {
  width?: number;
  height?: number;
  pattern?: string; // GeoPattern generator type
}

export class SVGGenerator {
  // All available GeoPattern generators for variety
  private static readonly patterns = [
    'octogons',
    'overlappingCircles',
    'plusSigns',
    'xes',
    'sineWaves',
    'hexagons',
    'overlappingRings',
    'plaid',
    'triangles',
    'squares',
    'concentricCircles',
    'diamonds',
    'tessellation',
    'nestedSquares',
    'mosaicSquares',
    'chevrons',
  ];

  // Category-based color schemes
  private static readonly categoryColors: Record<string, string> = {
    'Developer Experience': '#3b82f6',    // blue
    'API Design': '#8b5cf6',              // purple
    'Architecture': '#10b981',            // green
    'Testing': '#f59e0b',                 // amber
    'Performance': '#ef4444',             // red
    'Tutorial': '#06b6d4',                // cyan
    'Announcement': '#ec4899',            // pink
    'default': '#6366f1',                 // indigo
  };

  // Hash function to consistently select pattern based on title
  private static hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Generate SVG pattern for a blog post
   */
  static generateForPost(post: Post, options: SVGGeneratorOptions = {}): string {
    // Determine color based on category
    const category = post.metadata.categories?.[0] || 'default';
    const baseColor = this.categoryColors[category] || this.categoryColors.default;

    // Use title as seed for pattern variety
    const seed = post.slug || post.metadata.title;

    // Select pattern based on title hash (or use specified pattern)
    let generator: string;
    if (options.pattern) {
      generator = options.pattern;
    } else {
      const hash = this.hashString(seed);
      generator = this.patterns[hash % this.patterns.length];
    }

    // Generate pattern using GeoPattern
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pattern = GeoPattern.generate(seed, {
      color: baseColor,
      generator: generator as GeoPattern.GeneratorType,
    } as any);

    return pattern.toSvg();
  }

  /**
   * Get data URL for direct use in img src
   */
  static generateDataUrlForPost(post: Post, options: SVGGeneratorOptions = {}): string {
    const category = post.metadata.categories?.[0] || 'default';
    const baseColor = this.categoryColors[category] || this.categoryColors.default;
    const seed = post.slug || post.metadata.title;

    let generator: string;
    if (options.pattern) {
      generator = options.pattern;
    } else {
      const hash = this.hashString(seed);
      generator = this.patterns[hash % this.patterns.length];
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pattern = GeoPattern.generate(seed, {
      color: baseColor,
      generator: generator as GeoPattern.GeneratorType,
    } as any);

    return pattern.toDataUrl();
  }

  /**
   * Convert SVG string to data URL
   */
  static toDataURL(svg: string): string {
    const encoded = encodeURIComponent(svg);
    return `data:image/svg+xml,${encoded}`;
  }
}

