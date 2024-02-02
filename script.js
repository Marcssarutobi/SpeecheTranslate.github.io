const texarea = document.querySelector('textarea')
const button = document.querySelector('button')
let isSpeeking = true


const TexttoSpeech = ()=>{
    const synth = window.speechSynthesis
    const text = texarea.value

    if (!synth.speaking && text) {
        const utternance = new SpeechSynthesisUtterance(text)
        synth.speak(utternance)
    }

    if(text.length > 50){
        if (synth.speaking && isSpeeking) {
            button.innerText = "Pause"
            synth.resume()
            isSpeeking = false
        }else{
            button.innerText = "Resume"
            synth.pause()
            isSpeeking = true
        }
    }
}


button.addEventListener('click', TexttoSpeech)


// Translate to text

const selectTag = document.querySelectorAll('select'),
translatebtn = document.querySelector(".TranslateBtn"),
formText = document.querySelector(".from-text"),
toText = document.querySelector(".to-text"),
exchangeIcon = document.querySelector(".exchange"),
icons = document.querySelectorAll(".row i")

selectTag.forEach((tag, id) => {
    
    for (const country_code in countries){

        // console.log(countries[country_code])
        let selected
        if (id == 0 && country_code == "fr-FR") {
            selected = "selected"
        }else if (id == 1 && country_code == "en-GB") {
            selected = "selected"
        }
        let option = ` <option value="${country_code}" ${selected}>${countries[country_code]}</option>`
        tag.insertAdjacentHTML("beforeend",option) //Ajout d'une balise d'options dans la balise de sélection

    }

})

// Echange de position
exchangeIcon.addEventListener("click",()=>{
    let tempText = formText.value,
    tempLang = selectTag[0].value
    
    formText.value = toText.value
    toText.value = tempText
    selectTag[0].value = selectTag[1].value
    selectTag[1].value = tempLang
})

// Bouton de traduction
translatebtn.addEventListener("click",()=>{
    let text = formText.value,
    translateFrom = selectTag[0].value,
    translateTo = selectTag[1].value

    // console.log(text, translateFrom, translateTo)

    let apiUrl = `https://api.mymemory.translated.net/get?q=${text}!&langpair=${translateFrom}|${translateTo}` // Api link : https://mymemory.translated.net/doc/spec.php
    fetch(apiUrl).then(res => res.json()).then(data =>{
        // console.log(data)
        toText.value = data.responseData.translatedText
    })
})

icons.forEach(icon =>{
    icon.addEventListener("click",( {target} )=>{
        // console.log(target)

        if (target.classList.contains("fa-copy")) {
            
            if (target.id == "from") {
                navigator.clipboard.writeText(formText.value)
            }else{
                navigator.clipboard.writeText(toText.value)
            }

        }else{
            let utterance;
            if (target.id == "from") {
                utterance = new SpeechSynthesisUtterance(formText.value)
                utterance.lang = selectTag[0].value
            }else{
                utterance = new SpeechSynthesisUtterance(toText.value)
                utterance.lang = selectTag[1].value
            }
            speechSynthesis.speak(utterance)
        }

    })
})


// Calendrier

const calendarContainer = document.getElementById("calendar")
const currentDate = new Date()
const currentYear = currentDate.getFullYear()
const currentMonth = currentDate.getMonth()  
const currentDay = currentDate.getDate();

const nomMois = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
const Mois = nomMois[currentMonth]

function generateCalendar(year, month){

    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDayOfMonth = new Date(year, month, 1).getDay()

    let calendarHTML = `<h2>${Mois}, ${currentYear}</h2><table>`
    calendarHTML += `<tr><th>Dim</th><th>Lun</th><th>Mar</th><th>Mer</th><th>Jeu</th><th>Ven</th><th>Sam</th></tr>`

    let dayCount = 1

    for (let i = 0; i<6;i++ ){
        calendarHTML += `<tr>`
        for (let j = 0; j < 7; j++) {
            if(i === 0 && j < firstDayOfMonth){
                calendarHTML += '<td></td>';
            }else if (dayCount > daysInMonth) {
                break
            }else{
                const isToday = (dayCount === currentDay && month === currentMonth && year === currentYear);
                calendarHTML += `<td class="${isToday ? 'today' : ''}">${dayCount}</td>`;
                dayCount++;
            }
            
        }
        calendarHTML += '</tr>';
    }
    calendarHTML += '</table>';
    calendarContainer.innerHTML = calendarHTML;

    console.log(Mois , currentYear)

}
generateCalendar(currentYear, currentMonth);