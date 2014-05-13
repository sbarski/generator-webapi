using System.Collections.Generic;
using System.Web.Http;
<% if (autofac && core) { %>
using mycompany.mywebapi.Services;
<% } %>

namespace <%= safeprojectname %>.web.Controllers
{
    [RoutePrefix("api/values")]
    public class ValuesController : ApiController
    {
        <% if (autofac && core) { %>
        private readonly ISampleReadService _sampleReadService;

        public ValuesController(ISampleReadService sampleReadService)
        {
            _sampleReadService = sampleReadService;
        }
        <% } %>
 
        [Route]
        public IEnumerable<string> Get()
        {
            <% if (autofac && core) { %>
            return new string[] { "value1", "value2", _sampleReadService.ReadData() };
            <% } else { %>
            return new string[] { "value1", "value2" };
            <% } %>
        }

        [Route("{id:int}")]
        public string Get(int id)
        {
            return "value";
        }

        [Route]
        public void Post([FromBody]string value)
        {
        }

        [Route("{id:int}")]
        public void Put(int id, [FromBody]string value)
        {
        }

        [Route("{id:int}")]
        public void Delete(int id)
        {
        }
    }
}