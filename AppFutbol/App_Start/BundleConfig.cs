using System.Web.Optimization;

namespace AppFutbol
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            var minify = false;
            var min = minify ? ".min" : "";

            bundles.Add(new ScriptBundle("~/bundles/libraries").Include(
                        "~/Scripts/bootstrap.min.js",
                        "~/Scripts/jquery-3.5.1.min.js",
                        "~/Scripts/popper.min.js"));

            bundles.Add(new ScriptBundle("~/bundles/app").Include(
                        $"~/Scripts/app/common{min}.js"));

            bundles.Add(new StyleBundle("~/Content/libraries").Include(
                      "~/Content/bootstrap.min.css",
                      "~/Content/fontawesome/all.css",
                      "~/Content/webfonts/fa-solid-900.woff2"));

            bundles.Add(new StyleBundle("~/Content/app").Include(
                      $"~/Content/app/common{min}.css",
                      $"~/Content/app/dark{min}.css"));
        }
    }
}
