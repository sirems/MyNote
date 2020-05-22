using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Web.Http;
using MyNote.API.Models;

namespace MyNote.API.Controllers
{
    public class BaseApiController : ApiController
    {
        protected ApplicationDbContext db=new ApplicationDbContext();

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
