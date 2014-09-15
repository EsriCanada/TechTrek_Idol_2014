using System.Drawing;
using AForge;
using AForge.Imaging;
using AForge.Imaging.Filters;
using AForge.Imaging.Textures;

namespace Approx
{
    public static class AForgeExt
    {
        public static Bitmap AdaptiveSmoothing(this Bitmap bitmap)
        {
            return new AdaptiveSmoothing().Apply(bitmap);
        }

        public static Bitmap BayerDithering(this Bitmap bitmap)
        {
            return new BayerDithering().Apply(bitmap);
        }

        public static Bitmap BayerFilter(this Bitmap bitmap)
        {
            return new BayerFilter().Apply(bitmap);
        }

        public static Bitmap BayerFilterOptimized(this Bitmap bitmap)
        {
            return new BayerFilterOptimized().Apply(bitmap);
        }

        public static Bitmap Grayscale(this Bitmap bitmap)
        {
            return new Grayscale(1, 1, 1).Apply(bitmap);
        }

        public static Bitmap BilateralSmoothing(this Bitmap bitmap, int kernelSize, double spatialFactor, double colorFactor, double colorPower)
        {
            return new BilateralSmoothing
            {
                KernelSize = kernelSize,
                SpatialFactor = spatialFactor,
                ColorFactor = colorFactor,
                ColorPower = colorPower
            }
            .Apply(bitmap);
        }

        public static Bitmap BinaryDilatation3x3(this Bitmap bitmap)
        {
            return new BinaryDilatation3x3().Apply(bitmap);
        }

        public static Bitmap BinaryErosion3x3(this Bitmap bitmap)
        {
            return new BinaryErosion3x3().Apply(bitmap);
        }

        public static Bitmap BlobsFiltering(this Bitmap bitmap)
        {
            return new BlobsFiltering().Apply(bitmap);
        }

        public static Bitmap Blur(this Bitmap bitmap)
        {
            return new Blur().Apply(bitmap);
        }

        public static Bitmap BottomHat(this Bitmap bitmap)
        {
            return new BottomHat().Apply(bitmap);
        }

        public static Bitmap BradleyLocalThresholding(this Bitmap bitmap)
        {
            return new BradleyLocalThresholding().Apply(bitmap);
        }

        public static Bitmap BrightnessCorrection(this Bitmap bitmap, int adjustValue)
        {
            return new BrightnessCorrection(adjustValue).Apply(bitmap);
        }

        public static Bitmap Convolution(this Bitmap bitmap)
        {
            return new Convolution(new[,]
            {
                { -2, -1, 0 },
                { -1, 1, 1 },
                { 0, 1, 2 }
            })
            .Apply(bitmap);
        }

        public static Bitmap Dilatation(this Bitmap bitmap)
        {
            return new Dilatation().Apply(bitmap);
        }

        public static Bitmap Edges(this Bitmap bitmap)
        {
            return new Edges().Apply(bitmap);
        }

        public static Bitmap Erosion(this Bitmap bitmap)
        {
            return new Erosion().Apply(bitmap);
        }

        public static Bitmap Erosion3x3(this Bitmap bitmap)
        {
            return new Erosion3x3().Apply(bitmap);
        }

        public static Bitmap ErrorDiffusionToAdjacentNeighbors(this Bitmap bitmap)
        {
            return new ErrorDiffusionToAdjacentNeighbors(
                new[] {
                    new [] { 5, 3 },
                    new [] { 2, 4, 5, 4, 2 },
                    new [] { 2, 3, 2 }
                }).Apply(bitmap);
        }

        public static Bitmap EuclideanColorFiltering(this Bitmap bitmap, byte red, byte green, byte blue, short radius)
        {
            return new EuclideanColorFiltering
            {
                CenterColor = new RGB(red, green, blue),
                Radius = radius
            }
            .Apply(bitmap);
        }

        public static Bitmap ExtractBiggestBlob(this Bitmap bitmap)
        {
            return new ExtractBiggestBlob().Apply(bitmap);
        }

        public static Bitmap ExtractChannel(this Bitmap bitmap, short channel)
        {
            return new ExtractChannel(channel).Apply(bitmap);
        }

        public static Bitmap ExtractNormalizedRGBChannel(this Bitmap bitmap, short channel)
        {
            return new ExtractNormalizedRGBChannel(channel).Apply(bitmap);
        }

        public static Bitmap FillHoles(this Bitmap bitmap, int maxHoleHeight, int maxHoleWidth, bool coupledSizeFiltering)
        {
            return new FillHoles
            {
                MaxHoleHeight = maxHoleHeight,
                MaxHoleWidth = maxHoleWidth,
                CoupledSizeFiltering = coupledSizeFiltering
            }
            .Apply(bitmap);
        }

        public static Bitmap FloydSteinbergDithering(this Bitmap bitmap)
        {
            return new FloydSteinbergDithering().Apply(bitmap);
        }

        public static Bitmap GammaCorrection(this Bitmap bitmap, double gamma)
        {
            return new GammaCorrection(gamma).Apply(bitmap);
        }

        public static Bitmap GaussianBlur(this Bitmap bitmap, double sigma, int size)
        {
            return new GaussianBlur(sigma, size).Apply(bitmap);
        }

        public static Bitmap GaussianSharpen(this Bitmap bitmap, double sigma, int size)
        {
            return new GaussianSharpen(sigma, size).Apply(bitmap);
        }

        public static Bitmap BT709(this Bitmap bitmap)
        {
            return AForge.Imaging.Filters.Grayscale.CommonAlgorithms.BT709.Apply(bitmap);
        }

        public static Bitmap RMY(this Bitmap bitmap)
        {
            return AForge.Imaging.Filters.Grayscale.CommonAlgorithms.RMY.Apply(bitmap);
        }

        public static Bitmap Y(this Bitmap bitmap)
        {
            return AForge.Imaging.Filters.Grayscale.CommonAlgorithms.Y.Apply(bitmap);
        }

        public static Bitmap GrayscaleToRGB(this Bitmap bitmap)
        {
            return new GrayscaleToRGB().Apply(bitmap);
        }

        public static Bitmap HistogramEqualization(this Bitmap bitmap)
        {
            return new HistogramEqualization().Apply(bitmap);
        }

        public static Bitmap HomogenityEdgeDetector(this Bitmap bitmap)
        {
            return new HomogenityEdgeDetector().Apply(bitmap);
        }

        public static Bitmap HorizontalRunLengthSmoothing(this Bitmap bitmap, int maxGapSize)
        {
            return new HorizontalRunLengthSmoothing(maxGapSize).Apply(bitmap);
        }

        public static Bitmap HueModifier(this Bitmap bitmap, int hue)
        {
            return new HueModifier(hue).Apply(bitmap);
        }

        public static Bitmap Invert(this Bitmap bitmap)
        {
            return new Invert().Apply(bitmap);
        }

        public static Bitmap IterativeThreshold(this Bitmap bitmap, int minError, int threshold)
        {
            return new IterativeThreshold(minError, threshold).Apply(bitmap);
        }

        public static Bitmap JarvisJudiceNinkeDithering(this Bitmap bitmap)
        {
            return new JarvisJudiceNinkeDithering().Apply(bitmap);
        }

        public static Bitmap Jitter(this Bitmap bitmap, int radius)
        {
            return new Jitter(radius).Apply(bitmap);
        }

        public static Bitmap LevelsLinear(this Bitmap bitmap, int redMin, int redMax, int greenMin, int greenMax, int blueMin, int blueMax)
        {
            return new LevelsLinear
            {
                InRed = new IntRange(redMin, redMax),
                InGreen = new IntRange(greenMin, greenMax),
                InBlue = new IntRange(blueMin, blueMax)
            }
            .Apply(bitmap);
        }

        public static Bitmap Mean(this Bitmap bitmap)
        {
            return new Mean().Apply(bitmap);
        }

        public static Bitmap Median(this Bitmap bitmap)
        {
            return new Median().Apply(bitmap);
        }

        public static Bitmap OilPainting(this Bitmap bitmap)
        {
            return new OilPainting().Apply(bitmap);
        }

        public static Bitmap OtsuThreshold(this Bitmap bitmap)
        {
            return new OtsuThreshold().Apply(bitmap);
        }

        public static Bitmap Pixellate(this Bitmap bitmap)
        {
            return new Pixellate().Apply(bitmap);
        }

        public static Bitmap RotateChannels(this Bitmap bitmap)
        {
            return new RotateChannels().Apply(bitmap);
        }

        public static Bitmap SaturationCorrection(this Bitmap bitmap, float adjustValue)
        {
            return new SaturationCorrection(adjustValue).Apply(bitmap);
        }

        public static Bitmap Sepia(this Bitmap bitmap)
        {
            return new Sepia().Apply(bitmap);
        }

        public static Bitmap Sharpen(this Bitmap bitmap)
        {
            return new Sharpen().Apply(bitmap);
        }

        public static Bitmap Shrink(this Bitmap bitmap)
        {
            return new Shrink().Apply(bitmap);
        }

        public static Bitmap SierraDithering(this Bitmap bitmap)
        {
            return new SierraDithering().Apply(bitmap);
        }

        public static Bitmap SimplePosterization(this Bitmap bitmap)
        {
            return new SimplePosterization().Apply(bitmap);
        }

        public static Bitmap SimpleSkeletonization(this Bitmap bitmap)
        {
            return new SimpleSkeletonization().Apply(bitmap);
        }

        public static Bitmap SISThreshold(this Bitmap bitmap)
        {
            return new SISThreshold().Apply(bitmap);
        }

        public static Bitmap SobelEdgeDetector(this Bitmap bitmap)
        {
            return new SobelEdgeDetector().Apply(bitmap);
        }

        public static Bitmap StereoAnaglyph(this Bitmap bitmap)
        {
            return new StereoAnaglyph
            {
                OverlayImage = new CanvasMove(new IntPoint(10, 0), Color.Black).Apply(bitmap)
            }
            .Apply(bitmap);
        }

        public static Bitmap StuckiDithering(this Bitmap bitmap)
        {
            return new StuckiDithering().Apply(bitmap);
        }

        public static Bitmap CloudsTexture(this Bitmap bitmap, double filterLevel, double preserveLevel)
        {
            return new Texturer(new CloudsTexture(), filterLevel, preserveLevel).Apply(bitmap);
        }

        public static Bitmap LabyrinthTexture(this Bitmap bitmap, double filterLevel, double preserveLevel)
        {
            return new Texturer(new LabyrinthTexture(), filterLevel, preserveLevel).Apply(bitmap);
        }

        public static Bitmap MarbleTexture(this Bitmap bitmap, double filterLevel, double preserveLevel)
        {
            return new Texturer(new MarbleTexture(), filterLevel, preserveLevel).Apply(bitmap);
        }

        public static Bitmap TextileTexture(this Bitmap bitmap, double filterLevel, double preserveLevel)
        {
            return new Texturer(new TextileTexture(), filterLevel, preserveLevel).Apply(bitmap);
        }

        public static Bitmap WoodTexture(this Bitmap bitmap, double filterLevel, double preserveLevel)
        {
            return new Texturer(new WoodTexture(), filterLevel, preserveLevel).Apply(bitmap);
        }

        public static Bitmap Threshold(this Bitmap bitmap, int threshold)
        {
            return new Threshold(threshold).Apply(bitmap);
        }

        public static Bitmap ThresholdWithCarry(this Bitmap bitmap, byte threshold)
        {
            return new ThresholdWithCarry(threshold).Apply(bitmap);
        }

        public static Bitmap TopHat(this Bitmap bitmap)
        {
            return new TopHat().Apply(bitmap);
        }

        public static Bitmap VerticalRunLengthSmoothing(this Bitmap bitmap, int maxGapSize)
        {
            return new VerticalRunLengthSmoothing(maxGapSize).Apply(bitmap);
        }

        public static Bitmap WaterWave(this Bitmap bitmap, int horizontalWavesCount, int horizontalWavesAmplitude, int verticalWavesCount, int verticalWavesAmplitude)
        {
            return new WaterWave
            {
                HorizontalWavesCount = horizontalWavesCount,
                HorizontalWavesAmplitude = horizontalWavesAmplitude,
                VerticalWavesCount = verticalWavesCount,
                VerticalWavesAmplitude = verticalWavesAmplitude
            }
            .Apply(bitmap);
        }
    }
}
