const { fail } = require("assert")
const { upload } = require("./src/video/s3Connector.js")

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  })

function main(){
    var choices = "(1) Upload a file\n(2) Scan for faces in a video\n(3) Label Detection for Video\n(4) View my files\n(q) Quit"
    console.log("What would you like to do?")
    console.log(choices)

    readline.question("Choose an option: ", x => {
        resolveInput(x)
    })
}


function resolveInput(userInput){
    if(userInput=="q"){
        //exit the program
        fail("user quit the program")
    }else if(userInput=="1"){
        //upload a file
        readline.question("Input file path: ", x => {
            upload("video-crime-miner-video-test-bucket", x).then(response => {
                console.log(response)
            })
        })
    }else if(userInput=="2"){
        //scan video faces
        main()
    }else if(userInput=="3"){
        //label detection video
        main()
    }else if(userInput=="4"){
        //view files
        main()
    }else{
        console.log("ERROR: invalid choice")
        main()
    }
}




main()