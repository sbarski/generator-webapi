using System.Reflection;
using System.Web.Http;
using Autofac;
using Autofac.Integration.WebApi;

namespace <%= safeprojectname %>.web
{
    public static class AutofacConfig
    {
        public static void Register()
        {
            //Create the container builder
            var builder = new ContainerBuilder();

            //Register assembly types
            builder.RegisterAssemblyTypes(Assembly.GetExecutingAssembly())
                .PropertiesAutowired()
                .AsSelf()
                .AsImplementedInterfaces();

            <% if (core) { %>
            builder.RegisterAssemblyTypes(Assembly.GetAssembly(typeof(Services.ISampleReadService)))
                .PropertiesAutowired()
                .AsSelf()
                .AsImplementedInterfaces();
            <% } %>

            //Build the container
            var container = builder.Build();

            //Create the dependency resolver
            var resolver = new AutofacWebApiDependencyResolver(container);

            //Configure Web API with the dependency resolver
            GlobalConfiguration.Configuration.DependencyResolver = resolver;
        }
    }
}