

$(document).ready( () =>{

    //global variables
    let schedule;
    let jobs = [];
    let time = 0;


    //On click of reset button will reload application
    $('#resetBtn').click((e)=>{
        window.location.reload();
    });

    //on click of add button will execute code below
    $("#addBtn").click((e)=>{
        e.preventDefault();
        //if schedule hasnt been set, will set schedule
        if(!schedule){
           schedule = $("#schedule").val();
        }
        //adds new job to jobs array
        let jobID = $("#jobID").val();
        const jobArrival = parseInt($("#jobArrival").val());
        const jobCycle = parseInt($("#jobCycle").val())
        jobs.push(new Job(jobID,jobArrival,jobCycle));
    });

    //on run buttton click it will execute the selected schedule algorithm
    $("#runBtn").click((e) =>{
       e.preventDefault();
       $("#resultTable").show(); //shows hidden table
       if(schedule == 'FCFS'){
           FCFS();
       }else if(schedule =="SJN"){
           SJN();
       }else if(schedule == "SRT"){
           SRT();
       }else{//schedule == Round Robin
           RoundRobin();
       }
    });


    class Job{
        name;
        arrival;
        cycle;
        wait = 0;
        turnaround;
        completion;
        lastActiveTime;
        nextTurn =0;
        constructor(name, arrival, cycle) {
            this.name = name;
            this.arrival = arrival;
            this.cycle = cycle;
            this.lastActiveTime = arrival;
        }
    }

    function FCFS() {
        let completedJobs= [];
        let waitAvg;
        let turnaroundAvg;
        while(jobs.length > 0){
            let oldest;
            let minArrival = Number.MAX_VALUE;
            jobs.forEach(job =>{
                if(time >= job.arrival){
                    if(minArrival > job.arrival){
                        minArrival = job.arrival;
                        oldest = job;
                    }
                }
            });
            if(oldest){
                oldest.completion = time + oldest.cycle;
                oldest.wait = time - oldest.arrival;
                oldest.turnaround = oldest.arrival + oldest.completion;
                time = oldest.completion -1;
                $("#tr1").append('<td>' + oldest.name + '</td>')
                $("#tr2").append('<td>' + oldest.completion + '</td>')
                $("#tr3").append('<td>' + oldest.turnaround + '</td>')
                $("#tr4").append('<td>' + oldest.wait + '</td>')
                $("#tr5").append('<td>' + oldest.arrival + '</td>')
                completedJobs.push(jobs.splice(jobs.indexOf(oldest),1)[0]);
            }
            time++;
        }
        let waitSum = 0;
        let turnaroundSum = 0;
        completedJobs.forEach(job =>{
           waitSum =  waitSum + job.wait;
           turnaroundSum = turnaroundSum + job.turnaround;
        });
        turnaroundAvg = Math.floor((turnaroundSum/completedJobs.length)* 100)/100;
        waitAvg = Math.floor((waitSum/completedJobs.length)*100)/100;
        $("#avgTurnaround").html(`Average Turnaround: ${turnaroundAvg}`);
        $("#avgWaitTime").html(`Average Wait Time: ${waitAvg}`);
    }

    function SJN() {
        let completedJobs= [];
        let waitAvg;
        let turnaroundAvg;
        while(jobs.length > 0){
            let shortest;
            let minCycle = Number.MAX_VALUE;
            jobs.forEach(job =>{
                if(time >= job.arrival){
                    if(minCycle > job.cycle){
                        minCycle = job.cycle;
                        shortest = job;
                    }
                }
            });
            if(shortest){
                shortest.completion = time + shortest.cycle;
                shortest.wait = time - shortest.arrival;
                shortest.turnaround = shortest.arrival + shortest.completion;
                time = shortest.completion -1;
                $("#tr1").append('<td>' + shortest.name + '</td>')
                $("#tr2").append('<td>' + shortest.completion + '</td>')
                $("#tr3").append('<td>' + shortest.turnaround + '</td>')
                $("#tr4").append('<td>' + shortest.wait + '</td>')
                $("#tr5").append('<td>' + shortest.arrival + '</td>')
                completedJobs.push(jobs.splice(jobs.indexOf(shortest),1)[0]);
            }
            time++;
        }
        let waitSum = 0;
        let turnaroundSum = 0;
        completedJobs.forEach(job =>{
            waitSum =  waitSum + job.wait;
            turnaroundSum = turnaroundSum + job.turnaround;
        });
        turnaroundAvg = Math.floor((turnaroundSum/completedJobs.length)* 100)/100;
        waitAvg = Math.floor((waitSum/completedJobs.length)*100)/100;
        $("#avgTurnaround").html(`Average Turnaround: ${turnaroundAvg}`);
        $("#avgWaitTime").html(`Average Wait Time: ${waitAvg}`);
    }

    function SRT() {
        let completedJobs= [];
        let waitAvg;
        let turnaroundAvg;
        while(jobs.length > 0){
            let shortest;
            let minCycle = Number.MAX_VALUE;
            jobs.forEach(job =>{
                if(time >= job.arrival){
                    if(minCycle > job.cycle){
                        minCycle = job.cycle;
                        shortest = job;
                    }
                }
            });
            if(shortest){
                shortest.wait = (time - shortest.lastActiveTime) + shortest.wait;
                shortest.lastActiveTime = time + 1;
                shortest.cycle--;
                if(shortest.cycle == 0){
                    shortest.completion = time + 1;
                    shortest.turnaround = shortest.arrival + shortest.completion;
                    completedJobs.push(jobs.splice(jobs.indexOf(shortest),1)[0]);
                    $("#tr1").append('<td>' + shortest.name + '</td>')
                    $("#tr2").append('<td>' + shortest.completion + '</td>')
                    $("#tr3").append('<td>' + shortest.turnaround + '</td>')
                    $("#tr4").append('<td>' + shortest.wait + '</td>')
                    $("#tr5").append('<td>' + shortest.arrival + '</td>')
                }
            }
            time++;
        }
        let waitSum = 0;
        let turnaroundSum = 0;
        completedJobs.forEach(job =>{
            waitSum =  waitSum + job.wait;
            turnaroundSum = turnaroundSum + job.turnaround;
        });
        turnaroundAvg = Math.floor((turnaroundSum/completedJobs.length)* 100)/100;
        waitAvg = Math.floor((waitSum/completedJobs.length)*100)/100;
        $("#avgTurnaround").html(`Average Turnaround: ${turnaroundAvg}`);
        $("#avgWaitTime").html(`Average Wait Time: ${waitAvg}`);
    }

    function RoundRobin() {
        let completedJobs= [];
        let waitAvg;
        let turnaroundAvg;
        while(jobs.length > 0){
            let oldest;
            let minNextTurn = Number.MAX_VALUE;
            jobs.forEach(job =>{
                if(time >= job.arrival){
                    if(minNextTurn > job.nextTurn){
                        minNextTurn = job.nextTurn;
                        oldest = job;
                    }
                }
            });
            if(oldest){
                oldest.wait = (time - oldest.lastActiveTime) + oldest.wait;
                oldest.lastActiveTime = time + 3;
                oldest.nextTurn += 1;
                if(oldest.cycle <= 4){
                    oldest.completion = time + oldest.cycle;
                    oldest.turnaround = oldest.arrival + oldest.completion;
                    time += oldest.cycle -1;
                    $("#tr1").append('<td>' + oldest.name + '</td>')
                    $("#tr2").append('<td>' + oldest.completion + '</td>')
                    $("#tr3").append('<td>' + oldest.turnaround + '</td>')
                    $("#tr4").append('<td>' + oldest.wait + '</td>')
                    $("#tr5").append('<td>' + oldest.arrival + '</td>')
                    completedJobs.push(jobs.splice(jobs.indexOf(oldest),1)[0]);
                }else{
                    oldest.cycle = oldest.cycle - 4;
                    time += 3;
                }
            }
            time++;
        }
        let waitSum = 0;
        let turnaroundSum = 0;
        completedJobs.forEach(job =>{
            waitSum =  waitSum + job.wait;
            turnaroundSum = turnaroundSum + job.turnaround;

        });
        turnaroundAvg = Math.floor((turnaroundSum/completedJobs.length)* 100)/100;
        waitAvg = Math.floor((waitSum/completedJobs.length)*100)/100;
        $("#avgTurnaround").html(`Average Turnaround: ${turnaroundAvg}`);
        $("#avgWaitTime").html(`Average Wait Time: ${waitAvg}`);
    }
});