// Configuration du diaporama 
const config = {
    // Liste des noms de fichiers d'images (à remplacer par vos noms réels)
    image: [
        /*["learn/OLL-01.png", "chaise"],
        ["learn/OLL-02.png", "se-chai"],
        ["learn/OLL-03.png", "gridi dans une chaise"],
        ["learn/OLL-04.png", "Roi de la débrouille"],
        ["learn/OLL-05.png", "gros gridi / gros loma"],
        ["learn/OLL-06.png", "face alt / gros gridi / gros loma"],
        ["learn/OLL-07.png", "Roi de la débrouille"],
        ["learn/OLL-08.png", "gridi loma"],
        ["learn/OLL-09.png", "face shift / gridi"],
        ["learn/OLL-10.png", "shadow grosse chaise"],
        ["learn/OLL-11.png", "grosse chaise"],
        ["learn/OLL-12.png", "Roi de la débrouille"],
        ["learn/OLL-13.png", "right-top alt / loma"],
        ["learn/OLL-14.png", "shadow(push / pull) / partial digri"],
        ["learn/OLL-15.png", "push / pull / loma"],
        ["learn/OLL-16.png", "gros gridi / mid catch / digri"],
        ["learn/OLL-17.png", "gridi / mid throw / gros digri"],
        ["learn/OLL-18.png", "right-top alt / face shift / digri"],
        ["learn/OLL-19.png", "right-top shift / flow"],
        ["learn/OLL-20.png", "back-top alt / flow"],
        ["learn/OLL-21.png", "gros face shift / gridi"],
        ["learn/OLL-22.png", "gros face shift / double gridi"],
        ["learn/OLL-23.png", "shadow couple save / double digri"],
        ["learn/OLL-24.png", "shadow push / shadow partial pull / flow"],
        ["learn/OLL-25.png", "Puy du Fou"],
        ["learn/OLL-26.png", "gridi / intuitiv détour"],
        ["learn/OLL-27.png", "push / loma / retour en chaise"],
        ["learn/OLL-28.png", "fauteuille / retour en chaise"],
        ["learn/OLL-29.png", "face shift / pull"],
        ["learn/OLL-30.png", "gros pull / gros gridi"],
        ["learn/OLL-31.png", "Puy du Fou start"],
        ["learn/OLL-32.png", "couple save / gridi"],
        ["learn/OLL-33.png", "shadow couple save / shadow gridi"],
        ["learn/OLL-34.png", "gridi / corner trip"],
        ["learn/OLL-35.png", "face-top shift / chaise manquée"],
        ["learn/OLL-36.png", "se-chai / face shift gridi"],
        ["learn/OLL-37.png", "shadow se-chai / face shift / gridi"],*/
        ["learn/OLL-38.png", "face shift / double gridi"],
        ["learn/OLL-39.png", "face alt / left gridi"],
        ["learn/OLL-40.png", "2nd layer back dance"],
        ["learn/OLL-41.png", "2nd layer front dance"],
        ["learn/OLL-42.png", "digri dans une shadow grosse se-chai"],
        ["learn/OLL-43.png", "digri dans une grosse se-chai"]/*,
        ["learn/OLL-44.png", "Roi de la débrouille"],
        ["learn/OLL-45.png", "Roi de la débrouille"],
        ["learn/OLL-46.png", "Roi de la débrouille"],
        ["learn/OLL-47.png", "Roi de la débrouille"],
        ["learn/OLL-48.png", "Roi de la débrouille"],
        ["learn/OLL-49.png", "Roi de la débrouille"],
        ["learn/OLL-50.png", "Roi de la débrouille"],
        ["learn/OLL-51.png", "Roi de la débrouille"],
        ["learn/OLL-52.png", "Roi de la débrouille"],
        ["learn/OLL-53.png", "Roi de la débrouille"],
        ["learn/OLL-54.png", "Roi de la débrouille"],
        ["learn/OLL-55.png", "Roi de la débrouille"],
        ["learn/OLL-56.png", "Roi de la débrouille"],
        ["learn/OLL-57.png", "Roi de la débrouille"]*/
        // Ajoutez d'autres images selon vos besoins
    ]
};

// Variables d'état
let currentSeries = []; // Ordre des images pour la série actuelle
let currentIndex = -1;  // Index de l'image actuelle (-1 signifie avant le début)
let seriesHistory = []; // Historique des images visualisées dans cette série
let showingAnswer = 0;

// Variables pour la gestion des balayages tactiles
let touchStartX = 0;
let touchEndX = 0;

// Éléments du DOM
const imageContainer = document.querySelector(".image-container");
const answerText = document.querySelector(".answer");
const progressText = document.querySelector(".progress");
const endMessage = document.querySelector(".end-message");
const prevButton = document.getElementById("prev-button");
const nextButton = document.getElementById("next-button");
const showButton = document.getElementById("show-button");

// Initialisation du diaporama
function initSlideshow() {
    // Réinitialiser les variables d'état
    currentIndex = -1;
    seriesHistory = [];
    
    // Créer une copie du tableau d'images pour ne pas modifier l'original
    const imagesCopy = [...config.image];
    
    // Mélanger les images de façon aléatoire (algorithme de Fisher-Yates)
    for (let i = imagesCopy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [imagesCopy[i], imagesCopy[j]] = [imagesCopy[j], imagesCopy[i]];
    }
    
    // Définir l'ordre de la série actuelle
    currentSeries = imagesCopy;
    
    // Cacher le message de fin s'il était visible
    endMessage.style.display = "none";
    
    // Afficher l'état initial
    updateDisplay();
}

// Affiche l'image suivante
function showNextImage() {
    if (currentIndex < currentSeries.length - 1) {
        currentIndex++;
        seriesHistory.push(currentIndex);
        updateDisplay();
    } else {
        // Fin de la série
        endMessage.style.display = "block";
    }
}

// Revenir à l'image précédente
function showPreviousImage() {
    if (seriesHistory.length > 1) {
        // Supprimer l'index actuel de l'historique
        seriesHistory.pop();
        // Obtenir l'index précédent
        currentIndex = seriesHistory[seriesHistory.length - 1];
        updateDisplay();
        
        // Cacher le message de fin si on revient en arrière depuis la fin
        endMessage.style.display = "none";
    }
}

// Mettre à jour l'affichage
function updateDisplay() {
    // S'assurer qu'on n'est pas avant le début ou après la fin
    if (currentIndex >= 0 && currentIndex < currentSeries.length) {
        // Créer et afficher l'image
        const imagePath = currentSeries[currentIndex][0];
        imageContainer.innerHTML = `<img src="${imagePath}" alt="Image ${currentIndex + 1}">`;
        
        // Mettre à jour la réponse
        if (showingAnswer === 1){
            const imageText = currentSeries[currentIndex][1]
            answerText.textContent = imageText;
        } else {
            answerText.textContent = '';
        }

        // Mettre à jour le texte de progression
        progressText.textContent = `Vous êtes à l'image ${currentIndex + 1} sur ${currentSeries.length}`;
    } else if (currentIndex === -1) {
        // État initial avant le début de la série
        imageContainer.innerHTML = '<p>Appuyez sur la flèche droite pour commencer</p>';
        answerText.textContent = '';
        progressText.textContent = `Prêt à démarrer - ${currentSeries.length} images au total`;
    }
    
    // Mettre à jour l'état des boutons
    updateButtonStates();
}

// Mettre à jour l'état des boutons de navigation
function updateButtonStates() {
    // Désactiver le bouton précédent si on est au début
    prevButton.disabled = currentIndex <= 0;
    
    // Changer le texte du bouton suivant si on est à la fin
    if (endMessage.style.display === "block") {
        nextButton.textContent = "↻";  // Symbole de rechargement/recommencer
    } else {
        nextButton.textContent = "→";  // Flèche vers la droite
    }
}

// Gestionnaire d'événements pour les touches
function handleKeyPress(event) {
    // Flèche droite pour l'image suivante
    if (event.code === "ArrowRight" || event.key === "ArrowRight") {
        event.preventDefault(); // Empêcher le défilement de la page
        
        if (endMessage.style.display === "block") {
            // Si on est à la fin, recommencer une nouvelle série
            showingAnswer = 0;
            initSlideshow();
            showNextImage();
        } else {
            showingAnswer = 0;
            showNextImage();
        }
    }
    
    // Flèche gauche pour revenir en arrière
    if (event.code === "ArrowLeft" || event.key === "ArrowLeft") {
        event.preventDefault(); // Empêcher le défilement horizontal
        if (currentIndex > 0) { // Vérifier qu'on n'est pas au début
            showingAnswer = 0;
            showPreviousImage();
        }
    }

    if (event.code === "Space" || event.key === "Space") {
        event.preventDefault(); // Empêcher le défilement horizontal
        if (currentIndex >= 0) { // Vérifier qu'on n'est pas au début
            showingAnswer =  1 - showingAnswer * showingAnswer;
            console.log(showingAnswer);
            updateDisplay();
        }
    }
}

// Ajouter l'écouteur d'événements pour les touches
document.addEventListener("keydown", handleKeyPress);

// Initialiser les écouteurs d'événements tactiles
initTouchEvents();

// Initialiser le diaporama au chargement de la page
window.addEventListener("load", () => {
    initSlideshow();
    updateButtonStates();
});

// Fonction pour initialiser les événements tactiles
function initTouchEvents() {
    document.addEventListener('touchstart', handleTouchStart, false);
    document.addEventListener('touchend', handleTouchEnd, false);
    
    // Ajouter les écouteurs d'événements pour les boutons
    prevButton.addEventListener('click', () => {
        if (currentIndex > 0) {
            showingAnswer = 0;
            showPreviousImage();
        }
    });

    showButton.addEventListener('click', () => {
        if (currentIndex >= 0) {
            showingAnswer =  1 - showingAnswer * showingAnswer;
            console.log(showingAnswer);
            updateDisplay();
        }
    });
    
    nextButton.addEventListener('click', () => {
        if (endMessage.style.display === "block") {
            // Si on est à la fin, recommencer une nouvelle série
            showingAnswer = 0;
            initSlideshow();
            showNextImage();
        } else {
            showingAnswer = 0;
            showNextImage();
        }
    });
}

// Gestionnaire pour le début d'un toucher
function handleTouchStart(event) {
    touchStartX = event.changedTouches[0].screenX;
}

// Gestionnaire pour la fin d'un toucher
function handleTouchEnd(event) {
    touchEndX = event.changedTouches[0].screenX;
    handleSwipe();
}

// Fonction pour gérer les balayages
function handleSwipe() {
    const swipeThreshold = 50; // Distance minimale pour considérer un balayage
    
    if (touchEndX < touchStartX - swipeThreshold) {
        // Balayage vers la gauche (équivalent à flèche droite - image suivante)
        if (endMessage.style.display === "block") {
            // Si on est à la fin, recommencer une nouvelle série
            initSlideshow();
            showNextImage();
        } else {
            showNextImage();
        }
    }
    
    if (touchEndX > touchStartX + swipeThreshold) {
        // Balayage vers la droite (équivalent à flèche gauche - image précédente)
        if (currentIndex > 0) { // Vérifier qu'on n'est pas au début
            showPreviousImage();
        }
    }
}