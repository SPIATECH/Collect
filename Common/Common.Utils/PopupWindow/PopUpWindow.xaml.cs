//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License


using System;
using System.Collections.Generic;
using System.Windows;
using System.Windows.Media;
using System.Windows.Media.Imaging;

namespace Common.Utils.PopupWindow
{
    /// <summary>
    /// Images are loaded in this class for later re-use.
    /// </summary>
    public static class BrushChooser
    {
        private static ImageSource _fatalErrorImage = new BitmapImage(new Uri("pack://application:,,,/Common.Utils;component/PopupWindow/ErrorPopupWindow_fatalIcon.png"));

        public static ImageSource FatalErrorImge
        {
            get { return _fatalErrorImage; }
        }

        private static ImageSource _debugErrorImage = new BitmapImage(new Uri("pack://application:,,,/Common.Utils;component/PopupWindow/ErrorPopupWindow_debugIcon.png"));

        public static ImageSource DebugErrorImge
        {
            get { return _debugErrorImage; }
        }

        private static ImageSource _errorImage = new BitmapImage(new Uri("pack://application:,,,/Common.Utils;component/PopupWindow/ErrorPopupWindow_errorIcon.png"));

        public static ImageSource ErrorImge
        {
            get { return _errorImage; }
        }

        private static ImageSource _infoImage = new BitmapImage(new Uri("pack://application:,,,/Common.Utils;component/PopupWindow/ErrorPopupWindow_infoIcon.png"));

        public static ImageSource InfoImge
        {
            get { return _infoImage; }
        }

        private static ImageSource _traceErrorImage = new BitmapImage(new Uri("pack://application:,,,/Common.Utils;component/PopupWindow/ErrorPopupWindow_traceIcon.png"));

        public static ImageSource TraceErrorImge
        {
            get { return _traceErrorImage; }
        }

        private static ImageSource _warningImage = new BitmapImage(new Uri("pack://application:,,,/Common.Utils;component/PopupWindow/ErrorPopupWindow_warnIcon.png"));

        public static ImageSource WarningImge
        {
            get { return _warningImage; }
        }
    }

    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    ///
    public partial class PopUpWindow : Window
    {
        static PopUpWindow()
        {
            ImageChooser = new Dictionary<PopupChooser, ImageBrush> {
                    {PopupChooser.Fatal,new ImageBrush { ImageSource = BrushChooser.FatalErrorImge } },
                    {PopupChooser.Debug,new ImageBrush { ImageSource = BrushChooser.DebugErrorImge } },
                    {PopupChooser.Error,new ImageBrush { ImageSource = BrushChooser.ErrorImge } },
                    {PopupChooser.Info,new ImageBrush { ImageSource = BrushChooser.InfoImge } },
                    {PopupChooser.Trace,new ImageBrush { ImageSource = BrushChooser.TraceErrorImge }},
                    {PopupChooser.Warning,new ImageBrush { ImageSource = BrushChooser.WarningImge }}
            };
        }

        private PopUpWindow()
        {
            InitializeComponent();
            errorDetailTB.Text = null;
            showDetailButton.Visibility = Visibility.Collapsed;
        }

        /// <summary>
        /// Constructor with description
        /// </summary>
        /// <param name="PopupType">PopupChooser to be chosen by</param>
        /// <param name="message">Message to be displayed on Popup.</param>
        /// <param name="description">Description to be shown on Popup.</param>
        public PopUpWindow(PopupChooser PopupType, string message, string description = null) : this()
        {
            changeErrorType(PopupType);
            windowTitle.Text = PopupType.ToString();
            txtMessage.Text = message;
            if (!string.IsNullOrEmpty(description))
            {
                showDetailButton.Visibility = Visibility.Visible;
                errorDetailTB.Text = description;
            }
            bool isCloseButtonVisible = PopupType == PopupChooser.Fatal;
            if (!isCloseButtonVisible)
                btnClose.Visibility = Visibility.Collapsed;
            else
                btnContinue.Visibility = Visibility.Collapsed;
        }

        /// <summary>
        /// Constructor with Exception
        /// </summary>
        /// <param name="PopupType"></param>
        /// <param name="message"></param>
        /// <param name="exception"></param>
        public PopUpWindow(PopupChooser PopupType, string message, Exception exception) : this(PopupType, message, exception.ToString())
        {
        }

        private void showErrorDetail(object sender, RoutedEventArgs e)
        {
            if (showDetailButton.IsChecked == true)
                errorDetailTB.Visibility = Visibility.Visible;
            else
                errorDetailTB.Visibility = Visibility.Collapsed;
        }

        private void closeWindow(object sender, RoutedEventArgs e)
        {
            errorWindow.Close();
        }

        public int errorIndex = 0;
        public static Dictionary<PopupChooser, ImageBrush> ImageChooser;

        /// <summary>
        /// Change Icon based on Popup type
        /// </summary>
        /// <param name="ImageName">Should be taken from PopupChooser class.</param>
        private void changeErrorType(PopupChooser ImageName)
        {
            errorImageContainer.Background = ImageChooser[ImageName];
        }

        private void copyToClipboard(object sender, RoutedEventArgs e)
        {
            Clipboard.SetText(errorDetailTB.Text);
        }
    }
}