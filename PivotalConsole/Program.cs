﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using PivotalConnect;

namespace PivotalConsole {
	class Program {
		static void Main(string[] args) {
			var stories = Pivotal.Instance.GetStories();
			foreach (var story in stories) {
				Console.WriteLine(story.Name);
				Console.WriteLine("---------------------------------");
				foreach (var task in story.Tasks) {
					Console.WriteLine(" - {0}", task.GetDescriptionWithoutOwners());
					foreach (var owner in task.GetOwners()) {
						Console.WriteLine("    owned by {0}", owner.Name);
					}
				}
				Console.WriteLine("---------------------------------");
			}

			Console.ReadKey();
		}
	}
}