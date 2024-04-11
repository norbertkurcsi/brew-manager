# BrewManager - sőrfőző alkalmazás

## Bemutatás
Ez a kliens oldali alkalmazás a sőrfőzés folyamatához és annak adminisztrációjához nyújt segítséget a felhasználó számára. A bejelentkezett felhasználónak lehetősége nyílik a rektárban különböző hozzávalókon CRUD műveleteket végezni. Ezek mellett egy másik menüpontban sör recepteket lehet hozzáadni és módosítani. A harmadik menüpontban sörfőzés eseményeket lehet beütemezni egy adott dátumra, megadva, hogy melyik recept alapján szeretnénk ezt tenni.

Az alkalmazáshoz nem létezik nyílvánosan elérhető API, így a json-server dependencia segítségével húznék fel egy egyszerű API-t. Ezt a megoldást sokszor használják az iparban, amikor egy mock backendet szeretnének használni. Ezt a technológiát használva egy egyszerű json file-ból tudunk erőforrásokat szolgáltatni a frontend-es alkalmazásunknak. 

### Bejelentkezés oldal
Az alkalmazás indításakor egy bejelentkezés oldal vár ránk, ahol meg kell adnunk a felhasználó-jelszó párosunkat. Ha a bejelentkezés sikeres, akkor az inventory oldalra navigál minket az alkalmazás. Ellenkező esetben megfelelő hibakezeléssel értesít minket a hibáról.

### Inventory oldal
Az inventory oldalon kilistázódnak a jelenleg raktáron lévő hozzávalók, amiket a sőrfőzéshez használhatunk. Az adott listázás paginációt használ, így nem szükséges lekérni a teljes hozzávaló listát. A listát tudjuk rendezni a különböző mezők alapján illetve a pagináció oldalméretét is változtatni tudjuk. Egy hozzávalóhoz meg tudjuk adni, hogy jelenleg mennyi van raktáron, illetve egy threshold értéket is tudunk adni. Ez azért hasznos, mert ha a raktárkészlet a threshold érték alá esik, akkor ez a hozzávaló piros háttérrel fog megjelenni a listánkban. A hozzávalókat lehet módosítani, illetve törölni is.

### Receptek oldal
A receptek oldalon azt tartjuk számon, hogy milyen receptjeink vannak és azokhoz milyen és mennyi hozzávaló szükséges. A recepteknek adhatunk nevet, illetve a hozzávalókat úgy adhatjuk meg, hogy csak a jelenleg inventory-ban lévő hozzávalókat választhatjuk ki dinamikusan. Itt is lehet módosítani, illetve törölni is recepteket.

### Ütemezett főzés oldal
Ezen az oldalon sör főzéseket tudunk ütemezni. Ehhez ki kell választanunk, hogy milyen receptet szeretnénk használni, és ilyen dátumon szeretnénk főzni. Ezek után, ha ahhoz a recepthez van elegendő hozzávaló akkor sikerül beütemezni a főzést, és ekkor az adott recepthez szükséges hozzávalók levonódnak a raktárból. Ha egy adott ütemezést törlünk, akkor visszakerülnek a hozzávalók a raktárba.
