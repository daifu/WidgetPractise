/*

Use sample data from the data.html
This a a module of Contacts for displaying a person's contact info

Browser compability:
Functional on the following browsers:
IE6 and above, Firefox, Chrome, and Safari.
Minor UI issues with IE6

How to use:
1. Use the basic html code inside Contacts Area from index.html
2. include the app.js and app.css
3. Create Person objects, and store them into an array
4. Create Builder object with an sorted array of people
5. Type builder.run();
6. open your browser

Sample code:
...
var vivian = new Contacts.Person("Vivian", "vivian@altavista.com", "650-458-1234", "949 FooBar St.", "San Mateo", "CA", "98745", "images/vivian.gif");
var people = [amar, eric, gregor, jeff, jen, katie, vivian, deepa];
people.sort(function(p1, p2){ return p1.name > p2.name;});
var builder = new Contacts.Builder(people);
builder.run();

*/

var Contacts;
(function (Contacts) {
	// Model
	var Person = (function () {
		function Person (name, email, phone, address1, city, state, zip, image) {
			this.name = name;
			this.email = email;
			this.phone = phone;
			this.address1 = address1;
			this.city = city;
			this.state = state;
			this.zip = zip;
			this.image = image;
		}

		Person.prototype.set_address2 = function (address2) {
			this.address2 = address2;
		};

		Person.prototype.get_info_array = function() {
			var info = [];
			info.push(this.email);
			info.push(this.phone);
			info.push(this.address1);
			if (this.address2) {
				info.push(this.address2);
			}
			info.push(this.city);
			info.push(this.state);
			info.push(this.zip);

			return info;
		};

		Person.prototype.set_details_div = function(details_div) {
			this.details_div = details_div;
		};

		Person.prototype.set_person_div = function(person_div) {
			this.person_div = person_div;
		};

		Person.prototype.has_details_div = function() {
			if (this.details_div !== undefined) {
				return true;
			} else {
				return false;
			}
		};

		Person.prototype.has_person_div = function() {
			if (this.person_div !== undefined) {
				return true;
			} else {
				return false;
			}
		};
		return Person;
	})();

	// View controller
	var Builder = (function () {
		function Builder (people) {
			this.people = people;
			this.people_div = document.getElementById("people");
		}

		Builder.prototype.run = function () {
			this.add_people_dom();
			this.delegate_hover_event();
			this.delegate_mouseout_event();
			this.delegate_select_event();
		};

		// Construct the people list to the page for the first time.
		Builder.prototype.add_people_dom = function () {
			var ul = document.createElement("ul");
			var people_div = this.people_div;

			var size = people.length;
			for (var i = 0; i < size; i++) {
				var li = document.createElement("li");
				var name_div = document.createElement("div");
				name_div.className = "name";
				name_div.setAttribute("id", people[i].name);
				name_div.contactName = people[i].name;
				Utils.add_text(name_div, people[i].name);

				var email_div = document.createElement("div");
				var email_link = document.createElement("a");
				email_link.setAttribute("href", "mailto:"+people[i].email);
				Utils.add_text(email_link, people[i].email);
				email_div.appendChild(email_link);
				email_div.className = "email";
				li.appendChild(name_div);
				li.appendChild(email_div);
				ul.appendChild(li);
			}
			people_div.appendChild(ul);
		};

		// Added hover event to contact name
		Builder.prototype.delegate_hover_event = function() {
			var people_div = this.people_div,
				that = this;

			Utils.bind_event(people_div, "mouseover", function(e){
				var target = Utils.get_target(e);

				var targetPerson = Utils.get_person_by_name(that.people, target.contactName);
				if (targetPerson !== null) {
					Builder.show_person_details(targetPerson);
				}
			});
		};

		// Added mouseout event to contact name
		Builder.prototype.delegate_mouseout_event = function () {
			var people_div = this.people_div;
			var that = this;

			Utils.bind_event(people_div, "mouseout", function(e){
				var target = Utils.get_target(e);
				var targetPerson = Utils.get_person_by_name(that.people, target.contactName);
				if (targetPerson !== null) {
					Builder.hide_person_details(targetPerson);
				}
			});
		};

		// Added select event for the option
		Builder.prototype.delegate_select_event = function () {
			var people_div = this.people_div;
			var that = this;
			var select = document.getElementById("info_swap");

			Utils.bind_event(select, "change", function(e){
				var target = Utils.get_target(e);
				Builder.swap_people_detail(target.value, people_div, that.people);
			});
		};

		// Construct the view for a person's detail while hovering the contact name
		// Cache all the person's details for further hovering event
		// Todo: it might need to refactor the code because it is too long
		Builder.show_person_details = function(person) {
			if (person.has_details_div()) {
				// use cache
				person.details_div.style.display = "block";
				person.person_div.style.backgroundColor = "#f2f2f2";
				person.person_div.style.borderTop = "1px solid black";
				person.person_div.style.borderRight = "1px solid #f2f2f2";
				person.person_div.style.borderBottom = "1px solid black";
				person.person_div.style.zIndex = "2";

			} else {
				var person_div = document.getElementById(person.name),
					// email_div = person_div.nextElementSibling,
					people_holder = document.getElementById("people"),
					offsetX = person_div.offsetLeft + person_div.offsetWidth - 1,
					offsetY = person_div.offsetTop;
				var details_div = document.createElement("div"),
					info_div = document.createElement("div"),
					info_ul = document.createElement("ul"),
					img_div = document.createElement("div"),
					img = document.createElement("img"),
					all_info = person.get_info_array();
				person_div.style.backgroundColor = "#f2f2f2";
				details_div.className = "person_details";
				details_div.contactName = person.name;

				var email_li = document.createElement("li"),
					a_link = document.createElement("a");
				a_link.setAttribute("href", "mailto:"+person.email);
				Utils.add_text(a_link, person.email);
				email_li.appendChild(a_link);
				info_ul.appendChild(email_li);
				info_ul.contactName = person.name;
				// email_li.contactName = person.name;
				a_link.contactName = person.name;

				for (var i = 1; i < all_info.length; i++) {
					var info_li = document.createElement("li");
					Utils.add_text(info_li, all_info[i]);
					info_ul.appendChild(info_li);
					info_li.contactName = person.name;
				}

				info_div.appendChild(info_ul);
				info_div.className = "info_details";
				info_div.contactName = person.name;

				// style for details div
				details_div.style.position = "absolute";
				details_div.style.left = offsetX+"px";
				details_div.style.top = offsetY+"px";
				details_div.style.backgroundColor = "#f2f2f2";
				details_div.style.width = "202px";
				details_div.contactName = person.name;

				info_ul.style.margin = "0";

				img_div.className = "person_img";
				img_div.contactName = person.name;
				img.contactName = person.name;
				img.setAttribute("src", person.image);
				img_div.appendChild(img);

				details_div.appendChild(info_div);
				details_div.appendChild(img_div);

				person_div.style.backgroundColor = "#f2f2f2";
				person_div.style.borderTop = "1px solid black";
				person_div.style.borderRight = "1px solid #f2f2f2";
				person_div.style.borderBottom = "1px solid black";
				person_div.style.zIndex = "2";

				person.set_details_div(details_div);
				person.set_person_div(person_div);

				people_holder.appendChild(details_div);
			}
		};

		// Hide person's detail floating div
		Builder.hide_person_details = function(person) {
			if (person.has_details_div()) {
				person.details_div.style.display = "none";
			}
			if (person.has_person_div) {
				person.person_div.style.backgroundColor = "white";
				person.person_div.style.border = "1px solid white";
				person.person_div.style.zIndex = 0;
			}
			return false;
		};

		// Construct the view of changing the email to phone number, or visa versa.
		Builder.swap_people_detail = function(value, people_div, people) {
			var list = Utils.get_elements_by_class_name(people_div.childNodes[0], "email"),
				phones = Utils.get_elements_by_class_name(people_div.childNodes[0], "phone");
			if (value === "phone_number") {
				if (phones.length === 0) {
					for (var i = 0; i < list.length; i++) {
						var email_links = list[i];
						email_links.style.display = "none";

						var span = document.createElement("span");
						span.className = "phone";
						Utils.add_text(span, people[i].phone);
						email_links.parentNode.appendChild(span);
					}
				} else {
					for (var k = 0; k < list.length; k++) {
						list[k].style.display = "none";
					}

					for (var j = 0; j < phones.length; j++) {
						// phones[j].style.display = "inline-block";
						phones[j].style.display = "inline";
					}
				}
			} else if (value === "email") {
				for (var l = 0; l < list.length; l++) {
					// list[l].style.display = "inline-block";
					list[l].style.display = "inline";
				}
				for (var m = 0; m < phones.length; m++) {
					phones[m].style.display = "none";
				}
			}
		};

		return Builder;
	})();

	// Helper class that deal with cross browser compability
	var Utils = (function (){
		function Utils() {}

		Utils.index_of = function(array, test) {
			if (Utils.is_function(test)) {
				// otherwise, look for the index
				for (var x = 0; x < array.length; x++) {
					if (test(array[x])) return x;
				}
				// not found, return fail value
				return -1;
			} else {
				return -2; // not a function
			}
		};

		Utils.is_function = function(obj) {
			return typeof obj === 'function';
		};

		Utils.add_text = function(ele, text) {
			if (document.all) {
				ele.innerText = text;
			} else {
				ele.textContent = text;
			}
		};

		Utils.bind_event = function(ele, action, callback) {
			if (Utils.is_function(callback)) {
				if (ele.addEventListener) {
					ele.addEventListener(action, callback);
				} else {
					ele.attachEvent('on'+action, callback);
				}
			}
		};

		Utils.get_target = function(eve) {
			return (eve.target) ? eve.target : eve.srcElement;
		};

		Utils.get_elements_by_class_name = function(node, classname) {
			// credit: http://stackoverflow.com/questions/7410949/javascript-document-getelementsbyclassname-compatibility-with-ie
			var a = [];
			var re = new RegExp('(^| )'+classname+'( |$)');
			var els = node.getElementsByTagName("*");
			for(var i=0,j=els.length; i<j; i++)
				if(re.test(els[i].className))a.push(els[i]);
			return a;
		};

		Utils.get_person_by_name = function(people, name) {
			var nameIndex = Contacts.Utils.index_of(people, function(person) {
				return name === person.name;
			});
			if (nameIndex >= 0) {
				return people[nameIndex];
			} else {
				return null;
			}
		};
		return Utils;
	})();

	Contacts.Utils = Utils;
	Contacts.Person = Person;
	Contacts.Builder = Builder;
})(Contacts || (Contacts = {}));

var amar = new Contacts.Person("Amar", "amardeep@live.com", "408-555-1234", "555 Halford Ave.", "Santa Clara", "CA", "95051", "images/amar.gif");
amar.set_address2("Apartment #43C");
var deepa = new Contacts.Person("Deepa", "deepa@yahoo.com", "408-555-1234", "1234 Montcalm St.", "Chula Vista", "CA", "91911", "images/deepa.gif");
var eric = new Contacts.Person("Eric", "eric@ericrules.com", "408-555-1234", "10 Candyland", "North Pole", "PA", "87996", "images/eric.gif");
var gregor = new Contacts.Person("Gregor", "gregor@gmail.com", "897-984-3145", "Gregor Insurance Co.", "New York", "NY", "45879", "images/gregor.gif");
gregor.set_address2("1234 Strip St.");
var jeff = new Contacts.Person("Jeff", "jeff@aol.com", "408-555-1234", "1234 Montcalm St.", "Chula Vista", "CA", "91911", "images/jeff.gif");
var jen = new Contacts.Person("Jen", "jen@ebay.com", "408-555-1234", "1234 Lily St.", "San Diego", "CA", "91911", "images/jen.gif");
var katie = new Contacts.Person("Katie", "katie@ask.com", "415-555-1234", "949 Thunk Ct.", "Sacramento", "CA", "95826", "images/katie.gif");
var vivian = new Contacts.Person("Vivian", "vivian@altavista.com", "650-458-1234", "949 FooBar St.", "San Mateo", "CA", "98745", "images/vivian.gif");

var people = [amar, eric, gregor, jeff, jen, katie, vivian, deepa];
// make sure they are in order
people.sort(function(p1, p2){
	return p1.name > p2.name;
});
var builder = new Contacts.Builder(people);
builder.run();
