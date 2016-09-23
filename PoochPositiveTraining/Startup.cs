using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(PoochPositiveTraining.Startup))]
namespace PoochPositiveTraining
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
