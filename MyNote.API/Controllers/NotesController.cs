using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using MyNote.API.Models;

namespace MyNote.API.Controllers
{
    public class NotesController : BaseApiController
    {
        [HttpGet]
        public IQueryable<Note> List()
        {
            return db.Notes;
        }
    }

    //public class NoteDT
    // return Ok(db.Notes.Select(x=>new  NoteDTO{Baslik=x.Title,Yazar = x.Author.Email}).ToList());

    //{
    //    public string Baslik { get; set; }
    //    public string Yazar { get; set; }  
    //}
}
