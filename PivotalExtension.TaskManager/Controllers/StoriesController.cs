using System;
using System.Web.Mvc;
using PivotalTrackerDotNet;
using PivotalExtension.TaskManager.Models;
using PivotalTrackerDotNet.Domain;

namespace PivotalExtension.TaskManager.Controllers {
    public class StoriesController : BaseController {
        IStoryService service;
        IStoryService Service {
            get { return service ?? (service = new StoryService (Token)); }
        }
        public StoriesController () : this (null) { }

        public StoriesController (IStoryService service = null)
            : base () {
            this.service = service;
        }

        [HttpGet]
        public ActionResult CurrentIteration (int projectId) {
            return View (Service.GetCurrentStories (projectId));
        }

        //put is needed so we can redirect here from Put requests
        [AcceptVerbs(HttpVerbs.Put | HttpVerbs.Get)]
        public ActionResult Get (int projectId, int storyId) {
            return GetStory (storyId, projectId);
        }

        [HttpGet]
        public ActionResult BackLogStories (int projectId) {
            return View (Service.GetBacklogStories (projectId));
        }

        [HttpGet]
        public ActionResult IceboxStories (int projectId) {
            return View (Service.GetIceboxStories (projectId));
        }

        [HttpPut]
        public ActionResult Start (int projectId, int storyId) {
            var startedStory = Service.StartStory (projectId, storyId);
            return PartialView ("StoryRow", new StoryRowViewModel (startedStory));
        }

        [HttpPut]
        public ActionResult Finish (int projectId, int storyId) {
            var finishedStory = Service.FinishStory (projectId, storyId);
            return PartialView ("StoryRow", new StoryRowViewModel (finishedStory));
        }

        [HttpPost]
        public ActionResult AddTask (int projectId, int storyId, string description, string initials) {
            var task = new Task { Description = description, ParentStoryId = storyId, ProjectId = projectId };
            task.Description = AddInitialsToDescription(task, initials);
            Service.AddNewTask (task);
            return GetStory (storyId, projectId);
        }

        //TODO: this is duplicated from task controller, put somewhere better
        private string AddInitialsToDescription(Task task, string initials) {
            return new TaskViewModel(task).GetDescriptionWithoutOwners() + (string.IsNullOrEmpty(initials) ? "" : (" (" + initials.ToUpper() + ")"));
        }

        [HttpDelete]
        public ActionResult DeleteTask (int storyId, int projectId, int taskId) {
            Service.RemoveTask (projectId, storyId, taskId);
            return GetStory (storyId, projectId);
        }

        private ActionResult GetStory (int storyId, int projectId) {
            var story = Service.GetStory (projectId, storyId);
            return PartialView ("StoryRow", new StoryRowViewModel (story));
        }

        [HttpPost]
        public ActionResult AddComment(int projectId, int storyId, string comment) {
            Service.AddComment(projectId, storyId, comment);
            return GetStory(storyId, projectId);
        }
    }
}