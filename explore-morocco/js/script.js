/* =========================================================================
   Fichier: script.js
   Projet: Explore Morocco™ - Site officiel de l'Agence Nationale du Tourisme
   Rôle: Gérer l'interactivité côté client (validation, filtres, animations)
   =========================================================================
   POUR LES ÉTUDIANTS :
   JavaScript (JS) est le langage qui rend les pages web interactives.
   HTML = la structure  |  CSS = l'apparence  |  JS = le comportement.
   Ce fichier gère 4 fonctionnalités principales :
     1. Le bouton "Retour en haut"
     2. La validation du formulaire de contact
     3. Le filtre des avis / témoignages
     4. L'interaction avec la carte touristique
   ========================================================================= */

// On s'assure que le DOM (la structure de la page HTML) est complètement chargé
// avant d'exécuter nos scripts. Si on essaie de manipuler un élément HTML
// qui n'existe pas encore, JavaScript produira une erreur.
// 'DOMContentLoaded' se déclenche exactement quand tout le HTML est prêt.
document.addEventListener('DOMContentLoaded', function() {

    /* -------------------------------------------------------------------------
       1. BOUTON "RETOUR EN HAUT" (Back to top)
       -------------------------------------------------------------------------
       Ce bouton rond apparaît en bas à droite de l'écran quand l'utilisateur
       fait défiler la page. Un clic dessus remonte tout en haut en douceur.
       Son style visuel (rond, vert, fixe) est défini dans style.css (#backToTopBtn).
       ------------------------------------------------------------------------- */

    // On sélectionne l'élément HTML dont l'id est "backToTopBtn".
    // getElementById renvoie l'élément s'il existe, ou null s'il est absent.
    const backToTopBtn = document.getElementById("backToTopBtn");

    // On vérifie que le bouton existe bien sur la page courante avant d'agir.
    // Certaines pages n'ont pas ce bouton — ce "if" évite une erreur JavaScript.
    if (backToTopBtn) {

        // On "écoute" l'événement 'scroll' sur la fenêtre du navigateur.
        // La fonction entre accolades s'exécute CHAQUE FOIS que l'utilisateur scrolle.
        window.addEventListener('scroll', function() {

            // window.scrollY indique combien de pixels l'utilisateur a défilé vers le bas.
            // Si c'est plus de 300px (environ une hauteur d'écran), on affiche le bouton.
            if (window.scrollY > 300) {
                // "block" = l'élément s'affiche comme un bloc visible
                backToTopBtn.style.display = "block";
            } else {
                // En haut de la page (moins de 300px), on cache le bouton
                backToTopBtn.style.display = "none";
            }
        });

        // On écoute le clic sur le bouton.
        // Quand l'utilisateur clique, on le ramène en haut de la page.
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,          // On veut aller à la position 0 (tout en haut)
                behavior: 'smooth' // 'smooth' = défilement animé et fluide (pas brusque)
            });
        });
    }

    /* -------------------------------------------------------------------------
       2. VALIDATION DU FORMULAIRE DE CONTACT (Page contact.html)
       -------------------------------------------------------------------------
       Avant d'envoyer un formulaire, on vérifie que l'utilisateur a bien rempli
       tous les champs. C'est ce qu'on appelle la "validation côté client".
       Note : dans un vrai projet, il faut aussi valider côté serveur (backend) !
       ------------------------------------------------------------------------- */

    // On sélectionne le formulaire HTML par son identifiant unique.
    // Si on est sur une page sans formulaire, cette variable vaudra null.
    const contactForm = document.getElementById('contactForm');

    // On s'assure que le formulaire existe sur cette page avant de continuer.
    if (contactForm) {

        // On intercepte l'événement 'submit' (envoi du formulaire).
        // Cet événement se déclenche quand l'utilisateur clique sur le bouton "Envoyer".
        contactForm.addEventListener('submit', function(event) {

            // event.preventDefault() empêche le comportement par défaut du navigateur,
            // qui serait de recharger la page et d'envoyer les données à un serveur.
            // Ici, on n'a pas de serveur (backend), donc on gère tout nous-mêmes en JS.
            event.preventDefault();

            // On récupère ce que l'utilisateur a tapé dans chaque champ.
            // .value donne le texte saisi, .trim() enlève les espaces en début et fin
            // (évite qu'un utilisateur mette juste des espaces pour tromper la validation).
            const nom = document.getElementById('nom').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            
            // On sélectionne la zone HTML où on affichera les messages d'erreur ou de succès.
            const alertDiv = document.getElementById('formAlert');

            // --- RÈGLES DE VALIDATION (dans l'ordre d'importance) ---

            // Règle 1 : Le nom ne doit pas être vide.
            // Si nom === "" (chaîne vide), on affiche un message d'erreur rouge
            // et on arrête l'exécution avec "return" (pas la peine de vérifier le reste).
            if (nom === "") {
                showAlert(alertDiv, "Veuillez entrer votre nom.", "danger");
                return; // Arrête l'exécution de la fonction immédiatement
            }

            // Règle 2 : L'email doit contenir "@" et "." pour être valide.
            // .includes() vérifie si une chaîne contient un certain caractère.
            // On vérifie les deux : "test@gmail.com" contient "@" ET "."
            // Note : ce test simple n'est pas parfait — un vrai validateur serait plus robuste.
            if (!email.includes("@") || !email.includes(".")) {
                showAlert(alertDiv, "Veuillez entrer une adresse email valide contenant '@'.", "danger");
                return;
            }

            // Règle 3 : Le message ne doit pas être vide.
            // Un formulaire sans message n'a aucun sens — on force l'utilisateur à écrire quelque chose.
            if (message === "") {
                showAlert(alertDiv, "Veuillez entrer votre message.", "danger");
                return;
            }

            // Si on arrive ici, c'est que toutes les 3 vérifications ont réussi !
            // On affiche un message de succès vert dans la zone d'alerte.
            showAlert(alertDiv, "Merci pour votre message. Notre équipe vous répondra prochainement.", "success");
            
            // En plus de l'alerte dans la page, on affiche une boîte de dialogue native
            // du navigateur (popup) pour un retour encore plus visible à l'utilisateur.
            alert("Votre message a été envoyé avec succès ! Notre équipe (ENSATE) vous répondra très vite.");
            
            // On vide tous les champs du formulaire après un envoi réussi.
            // .reset() est une méthode intégrée aux formulaires HTML pour effacer les champs.
            contactForm.reset();
        });
    }

    // --- FONCTION UTILITAIRE : showAlert ---
    // Cette fonction est appelée depuis la validation ci-dessus.
    // Elle construit et injecte dynamiquement une alerte Bootstrap dans la page.
    // Paramètres :
    //   element = la div HTML où afficher l'alerte
    //   message = le texte à montrer à l'utilisateur
    //   type    = "danger" (rouge) pour erreur, ou "success" (vert) pour succès
    function showAlert(element, message, type) {
        // innerHTML permet d'écrire du HTML directement dans un élément.
        // On utilise les classes Bootstrap "alert alert-${type}" pour le style automatique :
        //   alert-danger  = fond rouge   (erreur)
        //   alert-success = fond vert    (succès)
        // Le bouton "btn-close" permet à l'utilisateur de fermer l'alerte manuellement.
        element.innerHTML = `<div class="alert alert-${type} alert-dismissible fade show" role="alert">
                                ${message}
                                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                             </div>`;
    }

    /* -------------------------------------------------------------------------
       3. FILTRE DES AVIS (Page experiences.html)
       -------------------------------------------------------------------------
       Sur la page des expériences, des boutons permettent de filtrer les avis
       par catégorie (villes, désert, plage, toutes...).
       Quand on clique sur un filtre, on affiche seulement les cartes correspondantes.
       ------------------------------------------------------------------------- */

    // querySelectorAll retourne UNE LISTE de tous les éléments correspondant au sélecteur.
    // Ici on sélectionne tous les éléments HTML avec la classe "filter-btn".
    const filterButtons = document.querySelectorAll('.filter-btn');

    // On sélectionne aussi toutes les cartes d'avis (classe "review-card").
    const reviewCards = document.querySelectorAll('.review-card');

    // On vérifie que les deux listes ne sont pas vides avant de continuer.
    // .length > 0 signifie "il y a au moins un élément dans la liste".
    if (filterButtons.length > 0 && reviewCards.length > 0) {

        // .forEach() parcourt chaque élément de la liste et exécute une fonction pour chacun.
        // On ajoute un écouteur de clic sur chaque bouton de filtre.
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {

                // On lit l'attribut HTML "data-filter" du bouton cliqué.
                // Les attributs "data-*" permettent de stocker des données personnalisées dans le HTML.
                // Exemple dans le HTML : <button data-filter="desert">Désert</button>
                const filterValue = this.getAttribute('data-filter');

                // On remet tous les boutons dans leur état normal (on retire la classe "active")
                // puis on ajoute "active" uniquement sur celui qu'on vient de cliquer.
                // Cela met à jour l'apparence pour montrer quel filtre est sélectionné.
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');

                // On passe en revue chaque carte d'avis pour décider si on l'affiche ou non.
                reviewCards.forEach(card => {

                    // On lit la catégorie de la carte depuis son attribut "data-category".
                    // Exemple dans le HTML : <div class="review-card" data-category="desert">
                    if (filterValue === 'toutes' || card.getAttribute('data-category') === filterValue) {
                        // La catégorie correspond au filtre choisi (ou on a cliqué "Toutes") :
                        // on affiche la carte en mode bloc.
                        card.style.display = 'block';
                    } else {
                        // La catégorie ne correspond pas : on cache la carte.
                        // display: 'none' retire l'élément de l'affichage (mais il reste dans le HTML).
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    /* -------------------------------------------------------------------------
       4. INTERACTION CARTE TOURISTIQUE (Page carte.html)
       -------------------------------------------------------------------------
       Sur la page de la carte, l'utilisateur peut cliquer sur des blocs de régions
       (Marrakech, Fès, Agadir...). Un clic met à jour :
         - Un panneau d'information avec le nom et la description de la région
         - La carte Google Maps intégrée (iframe) qui se recentre sur la région
       ------------------------------------------------------------------------- */

    // On sélectionne tous les blocs de région (classe "region-block").
    const regions = document.querySelectorAll('.region-block');

    // On sélectionne la zone d'affichage des informations (sous les blocs de région).
    const regionInfo = document.getElementById('regionInfo');

    // On vérifie que la page contient bien des régions ET la zone d'info.
    if (regions.length > 0 && regionInfo) {

        // On ajoute un écouteur de clic sur chaque bloc de région.
        regions.forEach(region => {
            region.addEventListener('click', function() {

                // On lit le nom et la description de la région depuis les attributs "data-".
                // Ces informations sont stockées directement dans le HTML, par exemple :
                // <div class="region-block" data-name="Marrakech" data-desc="La ville rouge...">
                const regionName = this.getAttribute('data-name');
                const regionDesc = this.getAttribute('data-desc');

                // On affiche les informations dans une alerte verte (Bootstrap alert-success).
                // On construit le HTML de l'alerte avec les données récupérées.
                regionInfo.innerHTML = `<div class="alert alert-success mt-3" role="alert">
                                            <h4 class="alert-heading">${regionName}</h4>
                                            <p class="mb-0">${regionDesc}</p>
                                        </div>`;
                
                // --- MISE À JOUR DE LA CARTE GOOGLE MAPS ---
                // On sélectionne l'iframe qui affiche la carte Google Maps.
                const mapFrame = document.getElementById('mapFrame');

                if (mapFrame) {
                    // On lit l'attribut "data-query" : c'est le terme de recherche pour Google Maps.
                    // Exemple : data-query="Marrakech, Maroc"
                    const mapQuery = this.getAttribute('data-query');

                    if (mapQuery) {
                        // On modifie l'URL source (src) de l'iframe pour charger la nouvelle région.
                        // encodeURIComponent() convertit les caractères spéciaux (espaces, accents)
                        // en format URL valide (ex: "Fès" devient "F%C3%A8s").
                        // z=6 est le niveau de zoom (6 = vue régionale, pas trop rapprochée).
                        mapFrame.src = `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&t=&z=6&ie=UTF8&iwloc=&output=embed`;
                    }
                }

                // Effet visuel de confort : on fait défiler la page jusqu'à la zone d'info
                // pour que l'utilisateur voie immédiatement le résultat de son clic,
                // même si le panneau d'info est un peu plus bas que son écran actuel.
                // 'nearest' = on scrolle le minimum nécessaire pour rendre l'élément visible.
                regionInfo.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            });
        });
    }

// Fin du gestionnaire DOMContentLoaded — tout le code ci-dessus s'est exécuté
// une fois que la page HTML était entièrement chargée et prête.
});
