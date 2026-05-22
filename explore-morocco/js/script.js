/* =========================================================================
   Fichier: script.js
   Projet: Explore Morocco™ - Site officiel de l'Agence Nationale du Tourisme
   Rôle: Gérer l'interactivité côté client (validation, filtres, animations)
   ========================================================================= */

// On s'assure que le DOM (la structure de la page) est complètement chargé avant d'exécuter nos scripts
document.addEventListener('DOMContentLoaded', function() {

    /* -------------------------------------------------------------------------
       1. BOUTON "RETOUR EN HAUT" (Back to top)
       ------------------------------------------------------------------------- */
    // On sélectionne le bouton via son ID
    const backToTopBtn = document.getElementById("backToTopBtn");

    // Si le bouton existe sur la page
    if (backToTopBtn) {
        // On écoute l'événement de défilement de la fenêtre (scroll)
        window.addEventListener('scroll', function() {
            // Si on a défilé de plus de 300 pixels vers le bas, on affiche le bouton
            if (window.scrollY > 300) {
                backToTopBtn.style.display = "block";
            } else {
                // Sinon, on le cache
                backToTopBtn.style.display = "none";
            }
        });

        // Quand on clique sur le bouton, on remonte en haut de la page en douceur (smooth)
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth' // Effet de défilement fluide
            });
        });
    }

    /* -------------------------------------------------------------------------
       2. VALIDATION DU FORMULAIRE DE CONTACT (Page contact.html)
       ------------------------------------------------------------------------- */
    // On sélectionne le formulaire de contact via son ID
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        // On intercepte la soumission du formulaire
        contactForm.addEventListener('submit', function(event) {
            // Empêche l'envoi réel du formulaire (puisqu'on n'a pas de backend)
            event.preventDefault();

            // Récupération des valeurs des champs
            const nom = document.getElementById('nom').value.trim(); // .trim() enlève les espaces vides
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            
            // On sélectionne la div où on va afficher l'alerte
            const alertDiv = document.getElementById('formAlert');

            // --- Règles de validation ---
            // 1. Le nom ne doit pas être vide
            if (nom === "") {
                showAlert(alertDiv, "Veuillez entrer votre nom.", "danger");
                return; // Arrête l'exécution de la fonction
            }

            // 2. L'email doit contenir un "@" et un point "."
            if (!email.includes("@") || !email.includes(".")) {
                showAlert(alertDiv, "Veuillez entrer une adresse email valide contenant '@'.", "danger");
                return;
            }

            // 3. Le message ne doit pas être vide
            if (message === "") {
                showAlert(alertDiv, "Veuillez entrer votre message.", "danger");
                return;
            }

            // Si toutes les vérifications passent, on affiche un message de succès (Bootstrap alert)
            showAlert(alertDiv, "Merci pour votre message. Notre équipe vous répondra prochainement.", "success");
            
            // NOUVEAUTÉ : Afficher également une popup (boîte de dialogue) claire au centre de l'écran
            alert("Votre message a été envoyé avec succès ! Notre équipe (ENSATE) vous répondra très vite.");
            
            // On vide le formulaire après le succès
            contactForm.reset();
        });
    }

    // Fonction utilitaire pour afficher les alertes Bootstrap
    function showAlert(element, message, type) {
        // On injecte le code HTML de l'alerte Bootstrap directement dans la div
        element.innerHTML = `<div class="alert alert-${type} alert-dismissible fade show" role="alert">
                                ${message}
                                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                             </div>`;
    }

    /* -------------------------------------------------------------------------
       3. FILTRE DES AVIS (Page experiences.html)
       ------------------------------------------------------------------------- */
    // On sélectionne tous les boutons de filtre
    const filterButtons = document.querySelectorAll('.filter-btn');
    // On sélectionne toutes les cartes d'avis
    const reviewCards = document.querySelectorAll('.review-card');

    if (filterButtons.length > 0 && reviewCards.length > 0) {
        // Pour chaque bouton de filtre
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // On récupère la valeur du filtre (ex: 'villes', 'desert', 'toutes')
                const filterValue = this.getAttribute('data-filter');

                // On met à jour l'état visuel des boutons (on active celui cliqué, on désactive les autres)
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');

                // Pour chaque carte d'avis
                reviewCards.forEach(card => {
                    // On vérifie si la catégorie de la carte correspond au filtre cliqué
                    if (filterValue === 'toutes' || card.getAttribute('data-category') === filterValue) {
                        card.style.display = 'block'; // On l'affiche
                    } else {
                        card.style.display = 'none'; // On la cache
                    }
                });
            });
        });
    }

    /* -------------------------------------------------------------------------
       4. INTERACTION CARTE TOURISTIQUE (Page carte.html)
       ------------------------------------------------------------------------- */
    // On sélectionne toutes les régions cliquables
    const regions = document.querySelectorAll('.region-block');
    // On sélectionne la zone d'alerte pour les infos
    const regionInfo = document.getElementById('regionInfo');

    if (regions.length > 0 && regionInfo) {
        regions.forEach(region => {
            // Quand on clique sur une région
            region.addEventListener('click', function() {
                // On récupère le nom et la description depuis les attributs 'data-'
                const regionName = this.getAttribute('data-name');
                const regionDesc = this.getAttribute('data-desc');

                // On affiche les informations dans une alerte verte (success)
                regionInfo.innerHTML = `<div class="alert alert-success mt-3" role="alert">
                                            <h4 class="alert-heading">${regionName}</h4>
                                            <p class="mb-0">${regionDesc}</p>
                                        </div>`;
                
                // --- NOUVEAUTÉ : Mise à jour de la carte Google Maps ---
                const mapFrame = document.getElementById('mapFrame');
                if (mapFrame) {
                    // On récupère le lieu à chercher depuis l'attribut data-query
                    const mapQuery = this.getAttribute('data-query');
                    if (mapQuery) {
                        // On met à jour l'iframe pour afficher la nouvelle région (avec zoom 6)
                        mapFrame.src = `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&t=&z=6&ie=UTF8&iwloc=&output=embed`;
                    }
                }

                // Petit effet visuel : on scroll jusqu'à l'information
                regionInfo.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            });
        });
    }
});
