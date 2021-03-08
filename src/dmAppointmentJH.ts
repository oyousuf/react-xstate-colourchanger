import { MachineConfig, send, Action, assign, actions} from "xstate";
import "./styles.scss";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { useMachine, asEffect } from "@xstate/react";
import { inspect } from "@xstate/inspect";

const {cancel} = actions

function say(text: string): Action<SDSContext, SDSEvent> {
    return send((_context: SDSContext) => ({ type: "SPEAK", value: text }))
}

function listen(): Action<SDSContext, SDSEvent> {
    return send('LISTEN')
}

function help(prompt: string, name: string): MachineConfig<SDSContext, any, SDSEvent>{
    return ({entry: say(prompt),
             on: {ENDSPEECH: name+".hist" }})
}

function speech(prompt: string): MachineConfig<SDSContext, any, SDSEvent>{
    return ({entry: say(prompt),
             on: {ENDSPEECH: "ask"
            }})
}

function promptAndAsk(prompt: string, prompt_a:string): MachineConfig<SDSContext, any, SDSEvent> {
    return ({
        initial: "prompt",
        states: {
            prompt: {
                entry: say(prompt),
                on: { ENDSPEECH: "ask" }
            },
            hist : {type: "history"},
            maxspeech: {
                ...speech(prompt_a)
            },
            ask: {
                entry: [listen(), send('MAXSPEECH', {delay: 6000})]
            },
        }})
}


const grammar: { [index: string]: { person?: string, day?: string, time?: string } } = {

    //name 
    "John": { person: "John Smith" },
    "Smith": { person: "Smith Wood" },
    "Tom": { person: "Tom Cruise" },
    "David": { person: "David Johansson" },
    "Emma": { person: "Emma Watson" },
    "Eric": { person: "Eric Kim" },
    "Alex": { person: "Alex Eriksson" },

    //day 
    "on monday" : { day: "Monday" },
    "on Monday" : { day: "Monday" },
    "on tuesday" : { day: "Tuesday" },
    "on Tuesday" : { day: "Tuesday" },
    "on wednesday" : { day: "Wednesday" },
    "on Wednesday" : { day: "Wednesday" },
    "on thursday" : { day: "Thursday" },
    "on Thursday" : { day: "Thursday" },
    "on Friday": { day: "Friday" },
    "on friday": { day: "Friday" },
    "on saturday" : { day: "Saturday"},
    "on Saturday" : { day: "saturday"},

	//time 
	"at one" : { time: "01:00" },
    "at two" : { time: "02:00" },
    "at three" : { time: "03:00"},
    "at four": { time: "04:00" },
    "at five": { time: "05:00" },
    "at six": { time: "06:00" },
    "at seven": { time: "07:00" },
    "at eight": { time: "08:00" },
    "at nine": { time: "09:00" },
    "at ten": { time: "10:00" },
    "at eleven": { time: "11:00" },
    "at twelve": { time: "12:00" },
    "at thirteen": { time: "13:00" },
    "at fourteen": { time: "14:00" },
    "at fifteen": { time: "15:00" },
    "at sixteen": { time: "16:00" },
    "at seventeen": { time: "17:00" },
    "at eighteen": { time: "18:00" },
    "at nineteen": { time: "19:00" },
    "at twenty": { time: "20:00" },
    "at twenty one": { time: "21:00" },
    "at twenty two": { time: "22:00" },
    "at twenty three": { time: "23:00" },
    "at twenty four": { time: "00:00" }
}


const grammar2 : { [index: string]: boolean }= { 

                  "yes": true,
                  "Yes": true,
				  "Of course": true,
                  "of course": true, 
                  "okay": true,
                  "Okay": true,
                  "No": false,
				  "no" : false,
				  "No way": false,
				  "no way" : false
}

const grammar3 ={"count": 0}

const help_commands = {"help": "Help", "Help": "Help"}



export const dmMachine: MachineConfig<SDSContext, any, SDSEvent> = ({
    initial: 'init',
    states: {
        init: {
            on: {
                CLICK: 'welcome'
            }
        },
		welcome: {
            initial: "prompt",
            on: {
                RECOGNISED: [{
                    target: "query",
                    cond: (context) => !(context.recResult in help_commands),
                    actions: [assign((context) => { return { option: context.recResult } }),assign((context) => { grammar3["count"]=0}),cancel("maxsp")],
                },

                {target: "welcome_help",
                cond: (context) => context.recResult in help_commands}], 
                

                MAXSPEECH: [{
                    target:".maxspeech",
                    cond: (context) => grammar3["count"] <= 2,
                    actions: assign((context) => { grammar3["count"]=grammar3["count"]+1 } )
                    },
                    {target: "#root.dm.init", 
                    cond: (context) => grammar3["count"] > 2, 
                    actions:assign((context) => { grammar3["count"]=0})}]
            },
            states: {        
                prompt: {
                entry: say("What would you like to do?"),
                on: { ENDSPEECH: "ask" }
            },
            hist: {type: "history"},

            maxspeech: {
                ...speech("Please respond. What would you like to do?")
        },  
            ask: {
                entry: [listen(), send('MAXSPEECH', {delay: 6000})]
            }
        }   
    }, 
    
        welcome_help:{
            ...help("Tell me what you want to do.", "welcome")
            
        },
		query: {
            invoke: {
                id: "rasa",
                src: (context, event) => nluRequest(context.option),
                onDone: {
                    target: "menu",
                    actions: [assign((context, event) => { return  {option: event.data.intent.name} }),
                    (context: SDSContext, event: any) => console.log(event.data), cancel("maxsp")]
                    //actions: assign({ intent: (context: SDSContext, event: any) =>{ return event.data }})

                },
                onError: {
                    target: "welcome",
                    actions: [(context, event) => console.log(event.data), cancel("maxsp")]
                }
            }
        },
      
        menu: {
            initial: "prompt",
            on: {
                ENDSPEECH: [
                    { target: "todo", cond: (context) => context.option === "todo" },
                    { target: "timer", cond: (context) => context.option === "timer" },
                    { target: "appointment", cond: (context) => context.option === "appointment" }
                ]
            },
            states: {
                prompt: {
                    entry: send((context) => ({
                        type: "SPEAK",
                        value: `OK. You chose ${context.option}.`
                    })),
        },
                 nomatch: {
                    entry: say("Sorry, please repeat again."),
                    on: { ENDSPEECH: "prompt" }
        } 
            }       
        },


        todo: {
            initial: "prompt",
            on: { ENDSPEECH: "init" },
            states: {
                prompt: {
                    entry: send((context) => ({
                        type: "SPEAK",
                        value: `Let"s create a to do item`
                    }))
                }}
        },
        
        timer: {
            initial: "prompt",
            on: { ENDSPEECH: "init" },
            states: {
                prompt: {
                    entry: send((context) => ({
                        type: "SPEAK",
                        value: `Let"s create a timer`
                    }))
                }}
        },
        
        
        appointment: {
            initial: "prompt",
            on: { ENDSPEECH: "who" },
            states: {
                prompt: {
                    entry: send((context) => ({
                        type: "SPEAK",
                        value: `Let's create an appointment!`
                    }))
                }}
        },
        who: {
            initial: "prompt",
            on: {
                RECOGNISED: [{
                    target: "day",
                    cond: (context) => "person" in (grammar[context.recResult] || {}),
                    actions: [assign((context) => { return { person: grammar[context.recResult].person } }),assign((context) => { grammar3["count"]=0}), cancel("maxsp")],
                    

                },

                { target: ".nomatch" ,
                 cond: (context) => !(context.recResult in help_commands),
                 actions: cancel("maxsp")},

                 {target: "who_help",
                 cond: (context) => context.recResult in help_commands}],
                 
                 MAXSPEECH: [{target:".maxspeech",
                 cond: (context) => grammar3["count"] <= 2,
                actions: assign((context) => { grammar3["count"]=grammar3["count"]+1 } )
                },{target: "#root.dm.init", 
                cond: (context) => grammar3["count"] > 2, 
                actions:assign((context) => { grammar3["count"]=0})}] 
            },
            states: {
                prompt: {
                    entry: say("Who are you meeting with?"),
                    on: { ENDSPEECH: "ask" }
                },
                hist: {type: "history"},
                ask: {
                    entry: [listen(), send('MAXSPEECH', {delay: 6000, id: "maxsp"})]
                },
                maxspeech: {
                    ...speech("Please respond, Who are you meeting with?")
                },
                nomatch: {
                    entry: say("Sorry I don't know them"),
                    on: { ENDSPEECH:  "prompt" }
                
                }
             }
        },
        who_help:{
            ...help("Please tell me the name of the person you are meeting with.","who")
        },

        day: {
            initial: "prompt",
            on: {
	            RECOGNISED: [{
	                cond: (context) => "day" in (grammar[context.recResult] || {}),
		             actions: [assign((context) => { return { day: grammar[context.recResult].day } }),assign((context) => { grammar3["count"]=0}),cancel("maxsp")],
		            target: "wholeday"

		        },	
		        { target: ".nomatch" ,
                cond: (context) => !(context.recResult in help_commands),
                actions: cancel("maxsp")},
                {target: "day_help",
                cond: (context) => context.recResult in help_commands}],
                MAXSPEECH: [{target:".maxspeech",
                cond: (context) => grammar3["count"] <= 2,
                actions: assign((context) => { grammar3["count"]=grammar3["count"]+1 } )
                },{target: "#root.dm.init", 
                cond: (context) => grammar3["count"] > 2, 
                actions:assign((context) => { grammar3["count"]=0})}] 
	        },

            states: {
                prompt: {
                    entry: send((context) => ({
                        type: "SPEAK",
                        value: `OK. You are meeting ${context.person} for the meeting. On which day is your meeting?`
                    })),
		            on: { ENDSPEECH: "ask" }
                },
                hist: {type: "history"},
		        ask: {
		            entry: [listen(), send('MAXSPEECH', {delay: 6000, id: "maxsp"})]
	            },
                maxspeech: {
                 ...speech("Please respond. Which day is your meeting?")
              },
		        nomatch: {
		            entry: say("Sorry I don't know which day are you talking about"),
		            on: { ENDSPEECH: "prompt" }
	            }	     
            }
        },
        day_help:{
            ...help("Please tell me which day your meeting is.","day")
        },
        
	    wholeday: {
		        initial: "prompt",
		        on: {
	                RECOGNISED: [{
			            cond: (context) => grammar2[context.recResult] === true,
                        target: "timefixed",
                        actions: [assign((context) => { grammar3["count"]=0}),cancel("maxsp")]},
						{
						cond: (context) => grammar2[context.recResult] === false,
						target: "settime",
                        actions: [assign((context) => { grammar3["count"]=0}),cancel("maxsp")]

		            },

	                { target: ".nomatch",
                    cond: (context) => !(context.recResult in help_commands),
                    actions: cancel("maxsp")},
                    {target: "wholeday_help",
                    cond: (context) => context.recResult in help_commands}],
                    MAXSPEECH: [{target:".maxspeech",
                    cond: (context) => grammar3["count"] <= 2,
                actions: assign((context) => { grammar3["count"]=grammar3["count"]+1 } )
                },{target: "#root.dm.init", 
                cond: (context) => grammar3["count"] > 2, 
                actions:assign((context) => { grammar3["count"]=0})}] 
		        },
		        states: {
		            prompt: {
			            entry: send((context) => ({
			                type: "SPEAK",
						    value: `Good.on ${context.day}. Will it take the whole day?`
			            })),
			            on: { ENDSPEECH: "ask" }
		            },
                    hist: {type: "history"},
		            ask: {
		                entry: [listen(), send('MAXSPEECH', {delay: 6000, id: "maxsp"})]
		            },
                    maxspeech: {
                      ...speech("Please respond.")
                    },
		            nomatch: {
			            entry: say("Please answer the question."),
		                on: { ENDSPEECH: "prompt" }
		            }
		        }	     
            },
            wholeday_help:{
                ...help("Please answer the question with yer or no.","wholeday")
            },
            timefixed: {
		           initial: "prompt",
	               on: {
		               RECOGNISED: [{ 
			               cond: (context) => grammar2[context.recResult] === true,
			               target: "Finished",
                           actions: [assign((context) => { grammar3["count"]=0}),cancel("maxsp")]},

						   {
							cond: (context) => grammar2[context.recResult] === false,
                           target: "who",
                           actions: [assign((context) => { grammar3["count"]=0}),cancel("maxsp")]
						   
		                },

		                { target: ".nomatch",
                        cond: (context) => !(context.recResult in help_commands),
                        actions: cancel("maxsp")},
                        {target: "timefixed_help",
                        cond: (context) => context.recResult in help_commands}],
                        MAXSPEECH: [{target:".maxspeech",
                        cond: (context) => grammar3["count"] <= 2,
                actions: assign((context) => { grammar3["count"]=grammar3["count"]+1 } )
                },{target: "#root.dm.init", 
                cond: (context) => grammar3["count"] > 2, 
                actions:assign((context) => { grammar3["count"]=0})}]  
		            },
		            states: {
		                prompt: {
			                entry: send((context) => ({
			                    type: "SPEAK",
								value: `Good. Do you want to me create an appointment with ${context.person} on ${context.day}for the whole day?`
                            })),
                            on: { ENDSPEECH: "ask" }
		                },
                        hist: {type: "history"},
		                ask: {
			                entry: [listen(), send('MAXSPEECH', {delay: 6000, id: "maxsp"})]
		                },
                        maxspeech: {
                             ...speech("Please respond. Confirm the meeting schedule.")},
		                nomatch: {
			                entry: say("Please repeat it again"),
			                on: { ENDSPEECH: "prompt" }
		                }
                    }
	            },
                timefixed_help:{
                    ...help("Confirm the meeting please.","timefixed")
                },
				settime: {
					initial: "prompt",
					on: {
						RECOGNISED: [{
							cond: (context) => "time" in (grammar[context.recResult] || {}),
							actions: [assign((context) => { return { time: grammar[context.recResult].time } }),assign((context) => { grammar3["count"]=0})],
							target: "confirm_time"

						},
						{ target: ".nomatch" ,
                        cond: (context) => !(context.recResult in help_commands),
                        actions: cancel("maxsp")},
                        {target: "settime_help",
                        cond: (context) => context.recResult in help_commands}],
                        MAXSPEECH: [{target:".maxspeech",
                        cond: (context) => grammar3["count"] <= 2,
                actions: assign((context) => { grammar3["count"]=grammar3["count"]+1 } )
                },{target: "#root.dm.init", 
                cond: (context) => grammar3["count"] > 2, 
                actions:assign((context) => { grammar3["count"]=0})}]  
					},
					states: {
						prompt: { entry: say("What time is your meeting"),
						on: { ENDSPEECH: "ask" }
					},
                    hist: {type: "history"},
					ask: {
						entry: [listen(), send('MAXSPEECH', {delay: 6000, id: "maxsp"})]
				},
                maxspeech: {
                  ...speech("Please respond. What time is your meeting?")
                },
				nomatch: {
					entry: say("Please repeat it again"),
					on: { ENDSPEECH: "prompt" }
				}
			}
		},
        settime_help:{
            ...help("Please tell me what time your meeting is.","settime")
        },
        
		confirm_time: {
			initial: "prompt",
			on: {
				RECOGNISED: [{ 
					cond: (context) => grammar2[context.recResult] === true,
					target: "Finished",
                    actions: assign((context) => { grammar3["count"]=0})},
					{
					cond: (context) => grammar2[context.recResult] === false,
					target: "who",
                    actions: [assign((context) => { grammar3["count"]=0}),cancel("maxsp")]

				 },
				 { target: ".nomatch",
                 cond: (context) => !(context.recResult in help_commands),
                 actions: cancel("maxsp")},
                 {target: "confirm_time_help",
                 cond: (context) => context.recResult in help_commands}],
                 MAXSPEECH: [{target:".maxspeech",
                 cond: (context) => grammar3["count"] <= 2,
                actions: assign((context) => { grammar3["count"]=grammar3["count"]+1 } )
                },{target: "#root.dm.init", 
                cond: (context) => grammar3["count"] > 2, 
                actions:assign((context) => { grammar3["count"]=0})}] 
			 },
			 states: {
				 prompt: {
					 entry: send((context) => ({
						 type: "SPEAK",
						 value: `Good. Do you want to me create an appointment with ${context.person} on ${context.day} at ${context.time}?`
					 })),
					 on: { ENDSPEECH: "ask" }
				 },
                 hist: {type: "history"},
				 ask: {
					 entry: [listen(), send('MAXSPEECH', {delay: 6000, id: "maxsp"})]
				 },
                maxspeech: {
                 ...speech("Please confirm the meeting schedule.")
                },        
				 nomatch: {
					 entry: say("Please repeat it again"),
					 on: { ENDSPEECH: "prompt" }
				 }
			 }
		},
        confirm_time_help:{
            ...help("Please confirm the meeting schedule","confirm_time")
        },
        
        Finished: {
		                 initial: "prompt",
		                 on: { ENDSPEECH: "init" },
		                 states: {
			                 prompt: { entry: say("Your appointment has been created!")
		                    },
	                    }
	                }	    
                }
            })


			/* RASA API
 *  */
const proxyurl = "https://cors-anywhere.herokuapp.com/";
const rasaurl = "https://appointment--app.herokuapp.com/model/parse"
const nluRequest = (text: string) =>
    fetch(new Request(proxyurl + rasaurl, {
        method: "POST",
        headers: { "Origin": "http://localhost:3000/react-xstate-colourchanger" }, // only required with proxy
        body: `{"text": "${text}"}`
    }))
        .then(data => data.json());
