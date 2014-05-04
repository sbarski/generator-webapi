using System.Collections.Generic;
using System.Web.Http;

namespace <%= safeprojectname %>.web.Controllers
{
    [RoutePrefix("api/values")]
    public class ValuesController : ApiController
    {
        [Route]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
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