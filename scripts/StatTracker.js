var StatTracker = new function() {
	this.baseUrl = "http://api.johnluetke.net/ingress/stats/";
	this.pageToLoad = "dashboard";
	this.message = null;

	this.loadPage = function() {
		$(".tabs li[class~='" + this.pageToLoad +"'] a").addClass("selected");
		$.ajax({url: this.baseUrl + "page/" + this.pageToLoad,
			type: "GET",
			dataType: "html",
			statusCode: {
				500: function() {
					alert("Internal Server Error");
				}
			},
			success: function(html) {
				$("#main-content").html(html);
				onPageLoad();
			}
		});
	}

	this.authenticate = function() {
		$.ajax({url: StatTracker.baseUrl + "authenticate?action=login",
			type: 'GET',
			contentType: 'json',
			success: function(result) {
				if (typeof result !== "object")
					result = JSON.parse(result);
				if (result.status == "authentication_required") {
					modal = $("#login-dialog").dialog("isOpen");
					if (!modal) $("#login-dialog").dialog("open");
					$("#login-buttons .google a").attr("href", result.url);
				}
				else if (result.status == "registration_required") {
					$("#login-buttons").hide();
					$("#login-dialog").dialog("open");
					message = "An email has been sent to<br/>";
					message += "<strong>" + result.email + "</strong>";
					message += "<br/>with steps to complete registration.";
					$("#login-message").html(message);
				}
				else if (result.status == "okay") {
					modal = $("#login-dialog").dialog("isOpen");
					if (modal) $("#login-dialog").dialog("close");
					if (result.agent.numSubmissions == 0) {
						StatTracker.message = "Stats must be submitted before this tool can be utilized";
						StatTracker.pageToLoad = "submit-stats";
					}

					StatTracker.loadPage();
				}
			},
			processData: false
		});

	}
};
