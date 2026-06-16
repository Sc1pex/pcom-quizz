const quizzes = [
    {
        "question": "Care este principală funcție a nivelului Legătură de Date (Data Link)?",
        "options": [
            "Alegerea celei mai bune rute prin rețea.",
            "Garantarea transmiterii cadrelor fără erori între două mașini conectate direct.",
            "Modularea biților în semnale electrice pe cablu.",
            "Stabilirea și gestionarea sesiunilor criptate între aplicații."
        ],
        "correctIndex": 1,
        "explanation": "Nivelul legătură de date transformă mediul fizic de transmisie brut într-o linie care pare fără erori pentru nivelul rețea, prin gruparea datelor în cadre (frames) și verificarea lor.",
        "chapterRef": 1,
        "searchKeyword": "gruparea datelor în cadre"
    },
    {
        "question": "Ce problemă principală rezolvă mecanismul de Control al Fluxului (Flow Control)?",
        "options": [
            "Pierderea completă a conexiunii fizice.",
            "Dirijarea greșită a pachetelor într-o subrețea.",
            "Un emițător rapid care supraîncarcă (inundă) un receptor mai lent.",
            "Detecția și corectarea erorilor pe un singur bit."
        ],
        "correctIndex": 2,
        "explanation": "Controlul fluxului folosește mecanisme de feedback (ex. protocolul cu fereastră glisantă) pentru a forța emițătorul să-și adapteze viteza la capacitatea de procesare a receptorului.",
        "chapterRef": 5,
        "searchKeyword": "reglare a fluxului de date"
    },
    {
        "question": "În metodă de încadrare (framing) folosind stegulețe (flags) cu bit stuffing, ce se întâmplă când în datele utile apare secvența care seamănă cu stegulețul (ex. șase de 1)?",
        "options": [
            "Pachetul este aruncat și se cere retransmisia.",
            "Emițătorul inserează forțat un bit de 0 după fiecare cinci biți de 1 din datele utile.",
            "Datele utile sunt criptate pentru a schimba secvența.",
            "Stegulețul este modificat temporar pentru acel cadru."
        ],
        "correctIndex": 1,
        "explanation": "Pentru ca receptorul să nu confunde datele utile cu stegulețul de sfârșit (01111110), emițătorul face 'bit stuffing': inserează un 0 după orice secvență de cinci biți de 1 consecutivi din date.",
        "chapterRef": 2,
        "searchKeyword": "cinci biţi de 1 consecutivi"
    },
    {
        "question": "Cum funcționează algoritmul de recuperare a erorilor 'Go-Back-N' (Retransmitere neselectivă)?",
        "options": [
            "Receptorul memorează cadrele sosite după o eroare și cere doar cadrul lipsă.",
            "Dacă un cadru este pierdut, receptorul ignoră (aruncă) toate cadrele primite ulterior, iar emițătorul trebuie să retransmită cadrul pierdut și pe toate cele care i-au urmat.",
            "Emițătorul trimite cadrele redundant, de două ori.",
            "Așteaptă confirmare (ACK) după fiecare cadru înainte să-l trimită pe următorul (Stop-and-Wait)."
        ],
        "correctIndex": 1,
        "explanation": "În Go-Back-N, fereastra receptorului are dimensiunea 1. El ignoră cadrele primite după o eroare, obligând emițătorul să se întoarcă și să retransmită tot.",
        "chapterRef": 5,
        "searchKeyword": "retransmitere neselectivă"
    },
    {
        "question": "Care este diferența majoră dintre o subrețea cu circuite virtuale și una datagramă?",
        "options": [
            "Circuitele virtuale sunt exclusiv analogice, iar datagramele digitale.",
            "La datagrame, rută este stabilită o singură dată la inițializare, în timp ce la circuite virtuale fiecare pachet alege o rută nouă.",
            "La circuite virtuale se stabilește în avans o cale fixă prin rețea pe care o vor urma toate pachetele, pe când la datagrame fiecare pachet este dirijat independent.",
            "Nu există nicio diferență la nivelul rutelor, diferă doar dimensiunea pachetului."
        ],
        "correctIndex": 2,
        "explanation": "O subrețea cu circuite virtuale creează o conexiune logică înainte de a trimite datele. Într-o rețea datagramă, fiecare pachet își găsește singur drumul pe bază adresei.",
        "chapterRef": 8,
        "searchKeyword": "circuite virtuale"
    },
    {
        "question": "Ce caracterizează algoritmii de dirijare (routing) statici (neadaptivi)?",
        "options": [
            "Răspund în timp real la aglomerația din rețea și ocolesc routerele picate.",
            "Deciziile de dirijare sunt calculate în avans (off-line) și încărcate în router, fără a ține cont de traficul curent.",
            "Trimit copii ale fiecărui pachet pe toate liniile disponibile (flooding).",
            "Măsoară constant timpul de întârziere către vecini (ping)."
        ],
        "correctIndex": 1,
        "explanation": "Dirijarea statică înseamnă că tabelele de rutare sunt fixe. Nu se adaptează la topologii dinamice sau congestii.",
        "chapterRef": 9,
        "searchKeyword": "în avans"
    },
    {
        "question": "În detectarea erorilor, de ce este preferat Codul Polinomial (CRC) în fața Parității simple?",
        "options": [
            "Pentru că se execută mai rapid din software.",
            "Pentru că scurtează dimensiunea pachetului.",
            "Pentru că poate corectă orice număr de erori, nu doar să le detecteze.",
            "Pentru că are o probabilitate mult mai mare să detecteze erori în rafală (burst errors)."
        ],
        "correctIndex": 3,
        "explanation": "CRC folosește împărțirea polinomială la nivel hardware și detectează practic toate rafalele de erori.",
        "chapterRef": 4,
        "searchKeyword": "codul polinomial"
    },
    {
        "question": "Conform Modelului OSI, care nivel se ocupă de dirijarea pachetelor de la o rețea la alta (routing)?",
        "options": [
            "Nivelul Fizic",
            "Nivelul Legătură de Date",
            "Nivelul Rețea",
            "Nivelul Transport"
        ],
        "correctIndex": 2,
        "explanation": "Nivelul rețea asigură dirijarea unităților de date între nodurile sursă și destinatar, trecând eventual prin noduri intermediare.",
        "chapterRef": 0,
        "searchKeyword": "dirijarea unitatilor de date"
    },
    {
        "question": "Care nivel OSI realizează o comunicare 'capăt la capăt' (end-to-end), ascunzând detaliile subrețelei de comunicare?",
        "options": [
            "Nivelul Legătură de Date",
            "Nivelul Rețea",
            "Nivelul Transport",
            "Nivelul Sesiune"
        ],
        "correctIndex": 2,
        "explanation": "Nivelul transport este primul nivel end-to-end care garantează o comunicare directă între procesele aplicație de pe gazdele terminale.",
        "chapterRef": 0,
        "searchKeyword": "capat la capat"
    },
    {
        "question": "Ce utilitate are câmpul Time To Live (TTL) dintr-un pachet IP?",
        "options": [
            "Stabilește durata de stocare a pachetului în cache-ul receptorului.",
            "Previne pachetele să rătăcească la infinit în rețea în cazul buclelor de dirijare.",
            "Măsoară viteza conexiunii fizice în milisecunde.",
            "Indică versiunea protocolului IPv4 sau IPv6."
        ],
        "correctIndex": 1,
        "explanation": "TTL este decrementat de fiecare ruter. Dacă ajunge la 0, pachetul este aruncat, prevenind buclele infinite de dirijare.",
        "chapterRef": 14,
        "searchKeyword": "Time to live"
    },
    {
        "question": "În protocoalele de dirijare Vector-Distanță (Distance Vector), ce este 'Problemă Numărării la Infinit' (Count-to-Infinity)?",
        "options": [
            "Routerele își trimit tabelele de rutare atât de des încât blochează rețeaua.",
            "Ruterele cresc costul unui drum spre o rețea picată în mod continuu, raportându-și rute false unul altuia, până când distanța atinge 'infinitul'.",
            "Procesorul ruterului calculează recursiv cea mai scurtă cale și epuizează memoria RAM.",
            "Când un ruter trimite un pachet la toți vecinii (flooding) iar aceștia îl trimit mai departe generând o furtună."
        ],
        "correctIndex": 1,
        "explanation": "Reacția lentă la veștile proaste face ca ruterele să crească progresiv metrica către o destinație inaccesibilă, crezând că trec unul prin celălalt.",
        "chapterRef": 9,
        "searchKeyword": "la infinit"
    },
    {
        "question": "Cum funcționează protocolul ARP (Address Resolution Protocol)?",
        "options": [
            "Interoghează un server DNS pentru a găsi adresă IP a unui nume de domeniu.",
            "Trimite un pachet de difuzare (broadcast) întrebând 'Cine are acest IP?' pentru a obține adresă MAC (Ethernet) corespunzătoare.",
            "Alocă automat o adresă IP dinamică mașinilor nou conectate în rețea.",
            "Criptează datele de la nivelul Fizic înainte de a le transmite pe fir."
        ],
        "correctIndex": 1,
        "explanation": "ARP difuzează un mesaj cerând adresă fizică (MAC) a dispozitivului care deține o anumită adresă logică (IP).",
        "chapterRef": 18,
        "searchKeyword": "Cine este proprietarul"
    },
    {
        "question": "Ce face serviciul DHCP (Dynamic Host Configuration Protocol)?",
        "options": [
            "Traduce adrese IP private în adrese IP publice.",
            "Efectuează teste de latență între două gazde.",
            "Alocă în mod automat și dinamic adrese IP și alte configurări de rețea mașinilor din rețea.",
            "Asigură securitatea transmisiunilor prin chei publice RSA."
        ],
        "correctIndex": 2,
        "explanation": "DHCP permite unui calculator să ceară o adresă IP de la un server, eliminând nevoia configurării manuale a IP-ului pe fiecare stație.",
        "chapterRef": 19,
        "searchKeyword": "DHCP"
    },
    {
        "question": "De ce avem nevoie de NAT (Network Address Translation)?",
        "options": [
            "Pentru a converti o rețea din IPv4 direct în IPv6 fără modificări hard.",
            "Pentru a ascunde un număr mare de IP-uri private interne în spatele unui singur (sau câteva) IP-uri publice vizibile pe internet.",
            "Pentru a îmbunătăți viteza cablurilor de cupru UTP.",
            "Pentru a asigura faptul că pachetele ajung întotdeauna în ordine la receptor."
        ],
        "correctIndex": 1,
        "explanation": "Datorită lipsei de adrese IPv4 libere, NAT permite unei întregi rețele locale (cu IP-uri private 192.168.x.x) să comunice cu exteriorul printr-un singur IP public.",
        "chapterRef": 16,
        "searchKeyword": "NAT"
    },
    {
        "question": "Care este principală caracteristică a protocolului ICMP?",
        "options": [
            "Este responsabil de stabilirea conexiunilor în trei pași (3-way handshake).",
            "Folosește algoritmi de rutare pentru a actualiza tabelele BGP.",
            "Raportează erorile din rețea înapoi sursei și ajută la diagnoză (ex: ping, traceroute).",
            "Înlocuiește complet protocolul IP pentru rețelele securizate."
        ],
        "correctIndex": 2,
        "explanation": "ICMP (Internet Control Message Protocol) e folosit de rutere și gazde pentru a transmite informații despre erori sau congestii.",
        "chapterRef": 17,
        "searchKeyword": "ICMP"
    },
    {
        "question": "Ce tip de protocol de dirijare este OSPF pe plan intern?",
        "options": [
            "Distance Vector (Vector-Distanță).",
            "Link State (Starea Legăturilor) – fiecare ruter are harta completă a rețelei interne.",
            "Exterior Gateway Protocol (BGP).",
            "Dirijare statică fixată manual de administrator."
        ],
        "correctIndex": 1,
        "explanation": "OSPF se bazează pe starea legăturilor, ceea ce înseamnă că fiecare ruter își construiește un graf cu întreaga rețea locală.",
        "chapterRef": 20,
        "searchKeyword": "OSPF"
    },
    {
        "question": "Pentru ce se utilizează protocolul BGP (Border Gateway Protocol)?",
        "options": [
            "Pentru a aloca adrese IP calculatoarelor de birou dintr-o companie.",
            "Pentru dirijarea traficului strict în interiorul rețelei unui singur ISP.",
            "Pentru a dirija pachete între Sisteme Autonome (AS) diferite pe tot Internetul (rutare la scară globală).",
            "Pentru criptarea traficului bancar de la capăt la capăt."
        ],
        "correctIndex": 2,
        "explanation": "BGP este 'lipiciul' Internetului. El decide pe unde curge traficul între companii și furnizori diferiți, ținând cont și de politici comerciale.",
        "chapterRef": 21,
        "searchKeyword": "BGP"
    },
    {
        "question": "Dimensiunea unei adrese IPv6 în comparație cu IPv4 este:",
        "options": [
            "64 biți față de 32 biți.",
            "128 biți față de 32 biți.",
            "256 biți față de 64 biți.",
            "128 octeți față de 4 octeți."
        ],
        "correctIndex": 1,
        "explanation": "Trecerea la IPv6 aduce o adresă lungă de 128 de biți (16 octeți), rezolvând criza de adrese IP valabile.",
        "chapterRef": 22,
        "searchKeyword": "128"
    },
    {
        "question": "Protocolul UDP (User Datagram Protocol) diferă de TCP prin faptul că:",
        "options": [
            "UDP este orientat-conexiune și garantează livrarea fiecărui pachet.",
            "UDP oferă un serviciu fără conexiune, best-effort (nu garantează ordinea sau livrarea) dar e mult mai rapid.",
            "UDP este folosit exclusiv pentru download-uri mari de fișiere (FTP).",
            "UDP include controale avansate de flux și congestie."
        ],
        "correctIndex": 1,
        "explanation": "UDP nu are mecanisme de retransmitere sau secvențiere, ci doar 'aruncă' pachetele spre destinație cu întârziere minimă.",
        "chapterRef": 24,
        "searchKeyword": "UDP"
    },
    {
        "question": "Care e funcționalitatea de bază a protocolului RTP (Real-time Transport Protocol)?",
        "options": [
            "Este un protocol de nivel fizic care folosește fibre optice pentru latență mică.",
            "Garantează livrarea de urgență a pachetelor oprind traficul celorlalți utilizatori.",
            "Multiplexează fluxuri media și adaugă numere de secvență/amprente de timp rulând, de regulă, peste UDP în spațiul utilizator.",
            "Transformă semnalul video din digital în analog."
        ],
        "correctIndex": 2,
        "explanation": "RTP adaugă timestamp-uri și numere de secvență ca aplicația multimedia să pună corect cap la cap pachetele (audio/video), chiar dacă e folosit UDP sub el.",
        "chapterRef": 25,
        "searchKeyword": "RTP"
    },
    {
        "question": "Cum asigură TCP-ul controlul congestiei în rețea?",
        "options": [
            "Folosind exclusiv mesaje ICMP Source Quench de la rutere.",
            "Variind algoritmic dimensiunea ferestrei de transmisie (ex. Slow Start, Congestion Avoidance) în funcție de confirmările primite sau pierdute.",
            "Obligând rețeaua să folosească circuite virtuale izolate.",
            "Forțând nivelul aplicație să trimită un număr constant de pachete pe secundă."
        ],
        "correctIndex": 1,
        "explanation": "TCP este 'politicos' – când detectează pachete pierdute (lipsă ACK-ului), presupune că e congestie și își înjumătățește viteza, apoi crește lent înapoi.",
        "chapterRef": 26,
        "searchKeyword": "TCP"
    },
    {
        "question": "În ce se traduce rolul DNS (Domain Name System)?",
        "options": [
            "Este agenda telefonică a internetului, convertind nume ușor de citit (www.site.ro) în adrese IP greu de memorat.",
            "Asigură securitatea la nivelul legăturii de date blocând atacurile.",
            "Negociază formatul paginilor web HTML (Prezentare).",
            "Gestionează tranzitul de email-uri (SMTP)."
        ],
        "correctIndex": 0,
        "explanation": "Oamenii preferă nume (google.com), iar ruterele preferă adrese IP (142.250.190.46). DNS face traducerea.",
        "chapterRef": 27,
        "searchKeyword": "DNS"
    },
    {
        "question": "La transferul poștei electronice, protocolul dominant pentru TRIMITEREA emailurilor între servere este:",
        "options": [
            "POP3",
            "IMAP",
            "SMTP",
            "HTTP"
        ],
        "correctIndex": 2,
        "explanation": "Simple Mail Transfer Protocol (SMTP) asigură transferul de email dinspre clientul tău spre serverul tău, și apoi mai departe către serverul destinatarului.",
        "chapterRef": 28,
        "searchKeyword": "SMTP"
    },
    {
        "question": "De ce se afirmă că HTTP este un protocol 'fără stare' (stateless)?",
        "options": [
            "Pentru că nu are suport pentru criptare implicit.",
            "Deoarece fiecare cerere de la un client către un server este tratată izolat, serverul neavând memorie internă a cererilor trecute.",
            "Pentru că nu păstrează conexiunile TCP deschise niciodată.",
            "Fiindcă adresele IP se schimbă constant cu DHCP."
        ],
        "correctIndex": 1,
        "explanation": "Din oficiu, serverul HTTP uită instant de tine după ce ți-a trimis pagina. Funcționalitatea de stare este adăugată extern prin Cookie-uri.",
        "chapterRef": 29,
        "searchKeyword": "HTTP"
    },
    {
        "question": "Care e aspectul atipic al protocolului FTP (File Transfer Protocol)?",
        "options": [
            "Folosește două porturi distincte în paralel, unul dedicat comenzilor de control (21) și unul exclusiv pentru fluxul de date (20).",
            "Nu se bazează pe TCP, ci pe UDP pur.",
            "A apărut abia după anul 2005, specializat pe fișiere uriașe.",
            "Transferă fișierele codate doar în hexazecimal pentru a evita coruperea datelor."
        ],
        "correctIndex": 0,
        "explanation": "Controlul (conexiunea unde scrii 'ls', 'get', 'put') e menținut separat față de fluxul binar de date propriu-zis, spre deosebire de HTTP care trimite tot pe aceeași țeavă.",
        "chapterRef": 30,
        "searchKeyword": "FTP"
    },
    {
        "question": "Care este slăbiciunea majoră a criptografiei cu Cheie Secretă (simetrică)?",
        "options": [
            "Viteza extrem de redusă a procesoarelor hardware la decriptare.",
            "Problemă 'distribuirii cheilor': Alice și Bob trebuie cumva să cadă de acord și să-și transmită cheia secretă prin alt mediu 100% sigur.",
            "Cifrul se poate sparge mereu în mai puțin de o oră.",
            "Necesită conectivitate constantă cu un server de certificate (CA)."
        ],
        "correctIndex": 1,
        "explanation": "Oricine obține cheia în timpul transmiterii acesteia poate intercepta și citi toată comunicarea ulterioară.",
        "chapterRef": 31,
        "searchKeyword": "cheie secreta"
    },
    {
        "question": "Pe ce principiu matematic se bazează rezistența cifrului cu cheie publică RSA?",
        "options": [
            "Generarea eficientă a numerelor pseudorandom cu dispersie mare.",
            "Operația extrem de lentă, nerezolvabilă în timp polinomial, de a factoriza un număr compus obținut din două numere prime gigantice.",
            "Ecuațiile curbelor eliptice peste un câmp Galois.",
            "Mascarea biților prin permutări pe o matrice 4x4 (ca la AES)."
        ],
        "correctIndex": 1,
        "explanation": "E ușor să înmulțești două numere prime foarte mari (p * q = n). E practic imposibil pentru un calculator să afle p și q plecând doar de la rezultatul n.",
        "chapterRef": 32,
        "searchKeyword": "RSA"
    },
    {
        "question": "În protocolul HDLC, care este cadrul folosit explicit pentru Confirmare Pozitivă a unui pachet?",
        "options": [
            "DISC (Disconnect)",
            "RECEIVE NOT READY",
            "RECEIVE READY (Tipul 0 Supervizor)",
            "REJECT (Tipul 1)"
        ],
        "correctIndex": 2,
        "explanation": "RECEIVE READY (RR) anunță emițătorul că datele au ajuns bine și cere următorul cadru din secvență.",
        "chapterRef": 6,
        "searchKeyword": "RECEIVE READY"
    },
    {
        "question": "Cum rezolvă algoritmii cu fereastră glisantă problemă duplicatelor cauzate de o confirmare pierdută?",
        "options": [
            "Receptorul ghicește inteligent dacă pachetul e duplicat din payload-ul său.",
            "Folosind Numere de Secvență în antetul fiecărui cadru.",
            "Calculând Suma de Control (CRC).",
            "Măsurând latența între cele două cadre."
        ],
        "correctIndex": 1,
        "explanation": "Includerea unui Număr de Secvență permite receptorului să vadă că noul cadru venit are același număr cu cel deja primit anterior, ignorându-l sigur.",
        "chapterRef": 5,
        "searchKeyword": "numere de secvenţă"
    },
    {
        "question": "La nivelul Fizic, ce rol are multiplexarea?",
        "options": [
            "Găsirea rutei celei mai optime pe glob.",
            "Permite trimiterea mai multor fluxuri de date / convorbiri simultan pe același mediu fizic comun (ex: Multiplexare prin Diviziunea Timpului/Frecvenței).",
            "Detectarea și corectarea erorilor pe bit.",
            "Formatarea interfețelor de conectare la router."
        ],
        "correctIndex": 1,
        "explanation": "Multiplexarea permite partajarea aceleiași linii scumpe (ex: cablu transatlantic) între sute de utilizatori simultan.",
        "chapterRef": 0,
        "searchKeyword": "fizic"
    }
];
