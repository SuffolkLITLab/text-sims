//===========================================
// API calls
//===========================================

function passcheck(login=0) {
	var verified;

    $('#live').empty();

    console.log("Checking verification")
    $('#output_wrapper').css("bottom","165px");
    $('#input_panel').show();
    $('#loading_box').show();
    $('#reply_box').hide();
    $('#action_box').hide();

	if (localStorage.passphrase) {
		$('#suffolk_pass_phrase').val(localStorage.passphrase);
	} else if (sessionStorage.passphrase) {
		$('#suffolk_pass_phrase').val(sessionStorage.passphrase);
	}
	passphrase = $('#suffolk_pass_phrase').val();
    var Data = { "p": passphrase }

    $.ajax({
      type: "GET",
      url: server + "/pass_check/",
      data: Data,

      //dataType: "json",
      // --- OR ---
      dataType: "jsonp",
      jsonpCallback: 'callback',

      contentType : "text/javascript",
      success: function(data) {
        verified = data["passed"];
		console.log("Verified: "+verified)
		console.log("Login: "+login)
		if (verified) {
			$('#logout_span').show();
			if (login!=-1) {
				$('#welcome').hide();
				$('#pass_ask').hide();
				if (login==1) {
					if ($("input[name='save_pass']:checked").val()=="1"){
						console.log("Saving passphrase in Local Storage.");
						localStorage.passphrase = $('#suffolk_pass_phrase').val();
						sessionStorage.removeItem("passphrase");
					} else {
						console.log("Saving passphrase in Session Storage.");
						sessionStorage.passphrase = $('#suffolk_pass_phrase').val();
						localStorage.removeItem("passphrase");
					}
				}
                load_state();
			}
		} else {
			if (login==1){
				$('#suffolk_pass_phrase').val("");
				$("#suffolk_pass_phrase").css("background-color", "yellow");
			}
			if (login!=-1) {
				$('#welcome').hide();
				$('#pass_ask').show();
				$('#suffolk_pass_phrase').focus();
			}
			$('#output_wrapper').css("bottom","60px");
			$('#input_panel').hide();
			$('#loading_box').hide();
			$('#reply_box').hide();
			$('#action_box').hide();    	
		}
	  },
      error: function (jqXHR, exception) {
        alert("There was an error verifying your access.");
		$('#output_wrapper').css("bottom","60px");
		$('#input_panel').hide();
		$('#loading_box').hide();
		$('#reply_box').hide();
		$('#action_box').hide();    
	  }
    });

}

function generategamestate() {
	var verified;

	task = get_state('task');

	if (localStorage.passphrase) {
		$('#suffolk_pass_phrase').val(localStorage.passphrase);
	} else if (sessionStorage.passphrase) {
		$('#suffolk_pass_phrase').val(sessionStorage.passphrase);
	}
	passphrase = $('#suffolk_pass_phrase').val();
    var Data = { "p": passphrase }

    $.ajax({
      type: "GET",
      url: server + "/generate_game_state/",
      data: Data,

      //dataType: "json",
      // --- OR ---
      dataType: "jsonp",
      jsonpCallback: 'callback',

      contentType : "text/javascript",
      success: function(data) {
		localStorage.game_state = data;

		complaint_data = {}
		complaint_data["client"] = get_state('client');
		complaint_data["court"] = get_state('court');
		complaint_data["complaint"] = get_state('complaint');
		complaint_data["complaintant"] = get_state('complaintant');
		
		report_data = complaint_data
		cori_data = complaint_data
		complaint_data = encodeURIComponent(JSON.stringify(complaint_data));

		report_data["complaint"] = get_state('complaint');
		report_data = encodeURIComponent(JSON.stringify(report_data));

		cori_data["complaint"] = get_state('complaint');
		cori_data = encodeURIComponent(JSON.stringify(cori_data));

		//console.log("Game State: "+data);

		if (task=='first_client_meeting') {
			$('#live').append(`<div style="text-align:right;width:100%;">Case No. <span>`+get_state('case_no')+`</span></div>
			<h3>Arraignment +0 Days <a href="manual/#meet" class="more">?</a></h3>
			<p>
			It's Monday morning and you're in the `+get_state('court')["name"]+`, located in Massachusetts. You are today's duty attorney, meaning you will be picking up new cases as they come in for arrainments and bail arguments. The clerk has given you a folder containing the following documents, a <a href="javascript:void('')" onClick="window.open(server+'/render_doc/?k=complaint&g=`+complaint_data+`','_blank');">complaint</a>, <a href="javascript:void('')" onClick="window.open(server+'/render_doc/?k=report&g=`+report_data+`','_blank');">incident report</a>, and <a href="javascript:void('')" onClick="window.open(server+'/render_doc/?k=cori&g=`+cori_data+`','_blank');">CORI</a>. They also let you know that the prosecutor is looking to hold your client. Your client is downstairs in lockup. Take a moment to review their documents, then head downstairs to meet them.
			</p>
			<span id="visit_client_in_lockup">
			<div class="options" style="display:show;box-sizing: border-box;max-width:300px;padding:0px 5px 0 5px;bottom:0px;margin: 15px auto;">
			<p>
				<input type="button" style="margin:0px 0 0 0px;width:100%;height:30px;background:rgb(187, 186, 186)" value='visit client in lockup' onclick="edit_state('task','visit_client_in_lockup');passcheck();" tabindex="4"/>
			</p>
			</div>
			</span>`);
		} else if (task=='other_task')  {
			// other leading text
		}
		
		localStorage.game_state = data;
		edit_state('screen',$('#live').html());
		edit_state('task',task)

		$('#output_wrapper').css("bottom","60px");
		$('#input_panel').hide();
		$('#loading_box').hide();
		$('#reply_box').hide();
		$('#action_box').hide();

	  },
      error: function (jqXHR, exception) {
        alert("There was an error accessing the game state.");
      }
    });
}

function bailinterview() {

	game_state = JSON.parse(localStorage.game_state);

	console.log("Removing scree data before API call")
	delete game_state["screen"];
	game_state = JSON.stringify(game_state);

	if (localStorage.passphrase) {
		$('#suffolk_pass_phrase').val(localStorage.passphrase);
	} else if (sessionStorage.passphrase) {
		$('#suffolk_pass_phrase').val(sessionStorage.passphrase);
	}
	passphrase = $('#suffolk_pass_phrase').val();
	//game_state = localStorage.game_state;

	var Data = { "game_state": game_state }	

	$.ajax({
		type: "POST",
		url: server + "/bail_interview/",
		data: JSON.stringify(Data),
		//data: Data,

		dataType: "json",
		crossDomain:true,
		// --- OR ---
		//dataType: "jsonp",
		//jsonpCallback: 'callback',

		contentType : "text/plain;charset=UTF-8",
		success: function(data) {
			//console.log("API reply: "+data);

			localStorage.game_state = data;

			if (JSON.parse(localStorage.game_state)['bail_interview_debrief_transcript'].length==0) {
				text = JSON.parse(localStorage.game_state)["bail_interview_transcript"][JSON.parse(localStorage.game_state)["bail_interview_transcript"].length - 1];
				typewrite(text,t=25,on_close_end=0)
			} else if (JSON.parse(localStorage.game_state)['bail_interview_debrief_transcript'].length<=4) {
				text = JSON.parse(localStorage.game_state)["bail_interview_debrief_transcript"][JSON.parse(localStorage.game_state)["bail_interview_debrief_transcript"].length - 1];
				typewrite(text,t=25,on_close_end=0)
			} else {
				text = JSON.parse(localStorage.game_state)["bail_interview_debrief_transcript"][JSON.parse(localStorage.game_state)["bail_interview_debrief_transcript"].length - 1];
				typewrite(text,t=25,on_close_end=1,on_close_write=`<p><i>
				NOTE: If you want to revisit this case in the future, you should save it to a file using the link above. To run another simulation, hit "New" above or load a senario using the "Open" link.
			</i></p><p>We'd love your feedback, consider completing this <a href="https://forms.gle/zJeZRRNr1vKShM4S7" target="_blank">three question survey</a>.</p>`)
			}

		},
		error: function (jqXHR, exception) {
			alert("There was an error running your bail interview.");
		}
	});

}

// EOF