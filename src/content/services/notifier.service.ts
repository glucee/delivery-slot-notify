export abstract class Notifier {

  protected audioSiren: HTMLAudioElement;

  initializeScript(): void {
    this.initializeNotifications();
    this.initializeNotifier();
    this.initializeWidget();
    this.audioSiren = new Audio("https://sndup.net/62k9/notification3.mp3");
  }

  protected abstract initializeNotifier(): void;

  protected abstract getSchedulePageIdentifier(): HTMLElement;

  protected abstract getSchedulePageIdentifierText(): string;

  // @ref: https://stackoverflow.com/a/13328513
  protected showNotification(): void {
   if (Notification.permission !== "granted")
    Notification.requestPermission();
   else {
    let notification = new Notification("Delivery Slot Available", {
     icon: "https://i.ibb.co/wrjsMv9/icon.png",
     body: "One or More Delivery Slots are Available",
    });
   }

   this.audioSiren.play();
  }

  protected initializeNotifications(): void {
    if (!Notification) {
      alert("Desktop notifications not supported by your browser.");
     }

    if (Notification.permission !== "granted")
      Notification.requestPermission();

    if (Notification.permission === "denied")
      alert("Your Chrome notifications are blocked. Please enable them to get \
      notifed about delivery windows availability. Click on the lock icon on \
      the top left and select 'Allow' from notification list");
  }

  protected initializeWidget(): void {
    let widgetInterval = setInterval(() => {
      let scheduleIdentifier = this.getSchedulePageIdentifier();
      let scheduleIdentifierText = this.getSchedulePageIdentifierText();
      let slotNotifier = document.querySelector<HTMLElement>(
        ".dsn-slot-notifier-widget"
      );

      if (!slotNotifier &&
          scheduleIdentifier &&
          scheduleIdentifier.innerText.includes(scheduleIdentifierText)
        ) {
        let widget = document.createElement("div");
        widget.innerHTML = `
          <div class="dsn-slot-notifier-widget">
            <p>
              <img
              src="https://i.ibb.co/wrjsMv9/icon.png"
              alt="icon"
              border="0"
              height="50">
            </p>
            <h3>
              Please leave this tab open and
              I will notify you when a delivery slot is available.
            </h3>
          </div>
        `;

        document.body.appendChild(widget);
      }
      else if (slotNotifier &&
        (!scheduleIdentifier ||
          !scheduleIdentifier.innerText.includes(scheduleIdentifierText))
        ) {
        slotNotifier.remove();
      }
    }, 500); // tslint:disable-line
  }
}
