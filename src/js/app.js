import Alpine from "alpinejs";
import persist from "@alpinejs/persist";
window.Alpine = Alpine;
Alpine.plugin(persist);

document.addEventListener("alpine:init", () => {
  Alpine.store("header", {
    watchingItems: Alpine.$persist([]),
    get watchlistItems() {
      return this.watchingItems.length;
    },
  });

  Alpine.data("toast", () => ({
    visible: false,
    delay: 2000,
    percent: 0,
    interval: null,
    timeout: null,
    message: null,
    close() {
      this.visible = false;
      clearInterval(this.interval);
    },
    show(message) {
      this.visible = true;
      this.message = message;

      if (this.interval) {
        clearInterval(this.interval);
        this.interval = null;
      }
      if (this.timeout) {
        clearTimeout(this.timeout);
        this.timeout = null;
      }

      this.timeout = setTimeout(() => {
        this.visible = false;
        this.timeout = null;
      }, this.delay);
      const startDate = Date.now();
      const futureDate = Date.now() + this.delay;
      this.interval = setInterval(() => {
        const date = Date.now();
        this.percent = ((date - startDate) * 100) / (futureDate - startDate);
        if (this.percent >= 100) {
          clearInterval(this.interval);
          this.interval = null;
        }
      }, 30);
    },
  }));

  Alpine.data("productItem", (product) => {
    return {
      id: product.id,
      product,
      quantity: 1,
      get watchlistItems() {
        return this.$store.watchlistItems;
      },
      addToWatchlist() {
        if (this.isInWatchlist()) {
          this.$store.header.watchingItems.splice(
            this.$store.header.watchingItems.findIndex(
              (p) => p.id === product.id
            ),
            1
          );
          this.$dispatch("notify", {
            message: "The item was removed from your watchlist",
          });
        } else {
          this.$store.header.watchingItems.push(product);
          this.$dispatch("notify", {
            message: "The item was added into the watchlist",
          });
        }
      },
      isInWatchlist() {
        return this.$store.header.watchingItems.find(
          (p) => p.id === product.id
        );
      },
      removeFromWatchlist() {
        this.$store.header.watchingItems.splice(
          this.$store.header.watchingItems.findIndex((p) => p.id === this.id),
          1
        );
      },
    };
  });
});


let GlobalData = {
  updateQuantity(line, qty) {
    fetch("/cart/change.js", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: qty, line: line }),
    })
      .then((response) => response.json())
      .then((data) => {
        // fire javascript event on window
        window.dispatchEvent(new Event("cart-updated"));
        document.querySelector("#cart_item_count_desktop").textContent = data.item_count
        document.querySelector("#cart_item_count_mobile").textContent = data.item_count
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  },
};

window.GlobalData = GlobalData;
Alpine.start();