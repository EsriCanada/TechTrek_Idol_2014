using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Net;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.UI;

namespace Approx
{
    public partial class Proxy : Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            Response.Clear();

            var url = Request.Url.Query.Substring(1);

            Func<string, string> request = n =>
                HttpUtility.UrlDecode(Regex.Match(url, @"(?<=((\?|&)" + n + @"\=)).*?(?=((\?|&|$)))").Value);

            var match = request("match");
            var tag = request("tag");
            var filters = request("filters");

            byte[] data;
            string contentType;

            using (var c = new WebClient())
            {
                data = c.DownloadData(url);
                contentType = c.ResponseHeaders["Content-Type"];
            }

            if (contentType.StartsWith("image/") && match == tag && filters != "")
            {
                Response.ContentType = "image/jpeg";

                var bitmap = new Bitmap(new MemoryStream(data));
                bitmap = bitmap.Clone(new Rectangle(0, 0, bitmap.Width, bitmap.Height), PixelFormat.Format24bppRgb);

                foreach (var f in filters.Split(';'))
                {
                    if (f.Trim() == "")
                        continue;

                    var m = Regex.Match(f, @"(?<name>((\w|\d|_)+))\s*?\(\s*?(?<args>(.*?))\s*?\)");

                    var method = typeof(AForgeExt).GetMethod(m.Groups["name"].Value);

                    var parameters = new object[] { bitmap }
                        .Concat(m.Groups["args"].Value.Split(',')
                            .Zip(method.GetParameters().Skip(1), (a, p) => Convert.ChangeType(a, p.ParameterType)))
                        .ToArray();

                    bitmap = (Bitmap)method.Invoke(null, parameters);
                }

                bitmap.Save(Response.OutputStream, ImageFormat.Jpeg);
            }
            else
            {
                Response.ContentType = contentType;
                Response.BinaryWrite(data);
            }
        }
    }
}
