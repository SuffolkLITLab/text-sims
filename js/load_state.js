//===========================================
// Load from saved state
//===========================================

function load_state(clear=0){

	if  (clear==1) {
		console.log("Reseting game state");
		localStorage.removeItem('game_state');
		console.log("Loading home");
		$('#welcome').show();
		$('#pass_ask').hide();
		
		$('#live').hide();
		$('#live').empty();

		$('#output_wrapper').css("bottom","60px");
		$('#input_panel').hide();
		$('#loading_box').hide();
		$('#reply_box').hide();
		$('#action_box').hide();
        $("#output_wrapper").scrollTop(0);

    } else {
		console.log("Loading game state");

        $('#live').html(get_state('screen'));

        if (((!get_state('client')) && (get_state('task'))) | ((get_state("task")=='first_client_meeting') && (!get_state("screen")))) {

            console.log("Loading case info");
            $('#welcome').hide();
            $('#pass_ask').hide();

            $('#live').show();
            
            $('#output_wrapper').css("bottom","165px");
            $('#input_panel').show();
            $('#loading_box').show();
            $('#reply_box').hide();
            $('#action_box').hide();

            $('#live').append(`<p>
            <i>
                NOTE: You'll miss a lot if you only play one round. You could play hundreds of rounds and not see everything! Each simulation generates a unique cases and clients combination to help explore different issues across. That being said, if you're using this simulation as part of a training, your instructor may have specific senarios they want you to work through, in which case, they should have provided you with a file to upload using the Open link above.
            </i>
            </p>`);
            edit_state('screen',$('#live').html());

            generategamestate();

        } else if (get_state("task")=='first_client_meeting') {

            $('#live').show();
            $('#output_wrapper').css("bottom","60px");
            $('#input_panel').hide();
            $('#loading_box').hide();
            $('#reply_box').hide();
            $('#action_box').hide();
            $("#output_wrapper").scrollTop($("#output_wrapper")[0].scrollHeight);

        } else if (get_state("task")=='visit_client_in_lockup') {
            console.log("Loading client interview");
            $('#welcome').hide();
            $('#pass_ask').hide();

            $('#live').show();

            if (get_state('bail_interview_debrief_transcript').length==5) {
                $('#output_wrapper').css("bottom","60px");
                $('#input_panel').hide();
                $('#loading_box').hide();
                $('#reply_box').hide();
                $('#action_box').hide();

                $('#do_botton').hide();

                $('#output_wrapper').css("bottom","60px");
                $('#input_panel').hide();
                $('#loading_box').hide();
                $('#reply_box').hide();
                $('#action_box').hide();
    
            } else {
                
                $('#output_wrapper').css("bottom","165px");
                $('#input_panel').show();
                $('#loading_box').show();
                $('#reply_box').hide();
                $('#action_box').hide();

                if (get_state('bail_interview_debrief_transcript').length==0) {
                    $('#do_botton').show();
                } else {
                    $('#do_botton').hide();
                }

                if (get_state('bail_interview_transcript').length == 0) {
                    $('#visit_client_in_lockup').remove();
                    $('#live').append(`<p>
                    <i>
                        NOTE: To speak with your client type your words below and hit Enter or Say. To hand them something or leave the room, hit Do and choose your desired action. Your goals are to: (1) get what you need to make a bail argument; (2) avoid talking about the facts of the case; and (3) to build a rapport with your client. You may want to review the duty day materials over on the <a href="https://suffolklitlab.org/incourt/" target="_blank">In Court app</a>.
                    </i>
                    </p>
                    <p>You enter lockup ask to see your client. The gaurd ... You reach the door and your client.</p>`);
                    edit_state('screen',$('#live').html());
                }

                // i'm not sure how well this handels during debrief, work some more???
                if (get_state('bail_interview_transcript').length%2==0) {
                    bailinterview();
                } else {
                    $('#input_panel').show();
                    $('#loading_box').hide();
                    $('#reply').val("");
                    $('#reply_box').show();
                    $('#action_box').hide();
                    $('#reply').focus();
                }
            }
            $("#output_wrapper").scrollTop($("#output_wrapper")[0].scrollHeight);
            
        } else {
            console.log("Loading home");
            $('#welcome').show();
            $('#pass_ask').hide();
            
            $('#live').hide();
            $('#live').empty();

            $('#output_wrapper').css("bottom","60px");
            $('#input_panel').hide();
            $('#loading_box').hide();
            $('#reply_box').hide();
            $('#action_box').hide();
            $("#output_wrapper").scrollTop(0);
        }

    }
}

// EOF