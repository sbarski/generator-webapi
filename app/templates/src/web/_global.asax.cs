using System.Web;
using System.Web.Http;
using System.Net.Http.Headers;
using System.Web.Http.Routing;
using Newtonsoft.Json.Serialization;

namespace <%= safeprojectname %>.web
{
    // Note: For instructions on enabling IIS6 or IIS7 classic mode, 
    // visit http://go.microsoft.com/?LinkId=9394801

    public class <%= globalclassname %> : HttpApplication
    {
        protected void Application_Start()
        {
            var constraintResolver = new DefaultInlineConstraintResolver();
            GlobalConfiguration.Configuration.MapHttpAttributeRoutes(constraintResolver);
        	
        	GlobalConfiguration.Configuration.Formatters.JsonFormatter.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
            GlobalConfiguration.Configuration.Formatters.JsonFormatter.SupportedMediaTypes.Add(new MediaTypeHeaderValue("application/hal+json"));
            <% if (autofac) { %>
            AutofacConfig.Register();
            <% } %>
            GlobalConfiguration.Configuration.EnsureInitialized();
        }
    }
}