﻿using System;
using System.Collections.Generic;
using System.Configuration;
using System.Web.UI.WebControls;
using PivotalTrackerDotNet;
using PivotalTrackerDotNet.Domain;

namespace PivotalExtension {
	public partial class _Default : System.Web.UI.Page {
        //TODO: these should be handled in login step, stored in session
		static readonly AuthenticationToken Token = AuthenticationService.Authenticate(ConfigurationManager.AppSettings["pivotalUserName"], ConfigurationManager.AppSettings["pivotalPassword"]);
		static readonly int ProjectId = int.Parse(ConfigurationManager.AppSettings["pivotalProjectId"]);

		protected static StoryService Service = new StoryService(Token);
		protected static List<Person> Members = new MembershipService(Token).GetMembers(ProjectId);

		protected bool HideCompletedTasks = false;

		protected void Page_Load(object sender, EventArgs e) {
			StoryRepeater.DataSource = Service.GetStories(ProjectId);
			StoryRepeater.DataBind();
		}

		protected void HideCompletedCheckbox_Click(object sender, EventArgs e) {
			HideCompletedTasks = HideCompletedCheckbox.Checked;
			StoryRepeater.DataBind();
		}

		protected void CompleteTaskLink_Click(object sender, EventArgs e) {
			var ids = ((LinkButton)sender).CommandArgument.Split(':');
		}
	}
}
