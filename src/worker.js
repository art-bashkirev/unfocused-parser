/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run "npm run dev" in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run "npm run deploy" to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
import markdownit from 'markdown-it';
import { DateTime } from 'luxon';

const globalForOffset = 2;

const md = markdownit('commonmark');

// TODO: Make work from Request body
const dateFormat = 'LLL d, yyyy';
const timeFormat = 'hh:mm a';

export default {
	async fetch(request, env, ctx) {
		var authDetails = request.headers.get('Authorization');

		if (authDetails && authDetails.split(' ')[0] === 'Bearer' && authDetails.split(' ')[1] === env.API_KEY) {
			if (request.method === 'POST' && request.headers.get('Content-Type') === 'text/plain' && (request.headers.get('Accept') === 'application/json' || request.headers.get('Accept') === '*/*') && request.body) {
				var markdownText = await request.text();
				var parsed = md.parse(markdownText);

				var currentDate = null;
				var currentTime = null;
				var currentDateTime = null;
				var tokenBlock = [];
				let jjson = {};
				let marked_json = [];

				/* Props: 
              		currentDate - DateTime object
              		currentTime - DateTime object
              		currentDateTime - DateTime object
              		tokenBlock - Array of tokens
					markedJson - 
			  	*/

				for (var i = 0; i < parsed.length; i++) {
					let currentToken = parsed[i];
					if (currentToken.type === 'heading_open' && currentToken.tag === 'h2') {
						// Set Current Date
						if (i + 1 >= parsed.length) {
							return new Response('Error: Missing Date', { status: 400 });
						}
						if (tokenBlock.length >= 1) {
							// Make HTML
							jjson.html = md.renderer.render(tokenBlock, md.options);
							marked_json.push(jjson);
						} // Make HTML
						currentDate = DateTime.fromFormat(parsed[i + 1].content, dateFormat);
						if (!currentDate.isValid) {
							return new Response('Error: Invalid Date Format', { status: 400 });
						}
						currentTime = null;
						currentDateTime = null;
						tokenBlock = [];
						jjson = {};
						i = i + globalForOffset;
						continue;
					}
					// Set Current Date / Reset
					else if (currentToken.type === 'heading_open' && currentToken.tag === 'h3') {
						// Set Current Time
						if (i + 1 >= parsed.length) {
							return new Response('Error: Missing Time', { status: 400 });
						}
						if (tokenBlock.length >= 1) {
							// Make HTML
							jjson.html = md.renderer.render(tokenBlock, md.options);
							marked_json.push(jjson);
						} // Make HTML
						currentTime = DateTime.fromFormat(parsed[i + 1].content, timeFormat);
						if (!currentTime.isValid) {
							return new Response('Error: Invalid Time Format', { status: 400 });
						}
						currentDateTime = currentDate.set({ hour: currentTime.hour, minute: currentTime.minute });
						tokenBlock = [];
						jjson = {};
						i = i + globalForOffset;
						continue;
					} // Set Current Time / Reset
					else {
						// Writing the token
						if (currentDateTime !== null) {
							// If there is time, it is assumpted that it is set in the currentDateTime
							tokenBlock.push(currentToken);
							jjson.time = currentDateTime;
						} else if (currentDate !== null) {
							// Else - there is only date
							tokenBlock.push(currentToken);
							jjson.time = currentDate;
							jjson.type = 'onlyDate'; // Only you (And You Alone)
						}
					}
				} // For loop - walking through tokens

				// Last time flush
				jjson.html = md.renderer.render(tokenBlock, md.options);
				marked_json.push(jjson);
				return new Response(JSON.stringify(marked_json), { headers: { 'Content-Type': 'text/json' } });
			}
			return new Response('Hello World!');
		} else {
			return new Response('Forbidden', { status: 403 });
		}
	},
};
