<template>
  <div>
    <button @click="downloadWithCSS">Download PDF</button>
    <div style="display: flex">
      <div>
        <ul>
          <li
            v-for="(item, index) in rooms"
            v-bind:key="index"
            v-on:click="selectedRoom(item)"
            style="display: block"
          >{{ item.id }}</li>
        </ul>
      </div>

      <div id="printThis" ref="content" style="width: 100%">
        <grid-layout
          :layout.sync="layout"
          :col-num="20"
          :row-height="30"
          :is-draggable="false"
          :is-resizable="false"
          :is-mirrored="false"
          :vertical-compact="true"
          :margin="[5, 0]"
          :use-css-transforms="false"
        >
          <grid-item
            v-for="(item, index) in layout"
            :x="item.x"
            :y="item.y"
            :w="item.w"
            :h="item.h"
            :i="item.i"
            :key="index"
          >{{item.i}}</grid-item>
        </grid-layout>
      </div>
    </div>
  </div>
</template>

<script>
import VueGridLayout from "vue-grid-layout";
import { firebaseInstance } from "../store.js";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default {
  components: {
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem
  },
  data() {
    return {
      layout: [],
      rooms: []
    };
  },

  async mounted() {
    await firebaseInstance.firebase
      .firestore()
      .collection("Rooms")
      .onSnapshot(querySnapshot => {
        querySnapshot.forEach(doc => {
          console.log(doc.data());
          this.rooms.push({
            id: doc.data().id,
            roomName: doc.data().desc
          });
        });
      });
  },

  methods: {
    selectedRoom(room) {
      this.layout = [];
      this.displayStudents(room.id);
    },

    async displayStudents(id) {
      var students;

      await firebaseInstance.firebase
        .firestore()
        .collection("Rooms")
        .doc(id)
        .get()
        .then(doc => {
          students = doc.data();
        });

      for (let x = 0; x < 10; x++) {
        for (let y = 0; y < 5; y++) {
          if (students.studentsList.length > y * 10 + x) {
            var name = students.studentsList[y * 10 + x];
            this.layout.push({
              x: x * 2,
              y: y * 2,
              w: 2,
              h: 2,
              i: name
            });
          } else {
            this.layout.push({
              x: x * 2,
              y: y * 2,
              w: 2,
              h: 2,
              //i: students.studentsList[(y*10) + x]
              i: ""
            });
          }
        }
      }
    },
    download() {
      const doc = new jsPDF();
      const contentHtml = this.$refs.content.innerHTML;
      doc.fromHTML(contentHtml, 15, 15, {
        width: 170
      });
      doc.save("attendance.pdf");
    },

    downloadWithCSS() {
      /** WITH CSS */

      //  var canvasElement = document.createElement("canvas");
      html2canvas(document.getElementById("printThis")).then(function(canvas) {
        //  THIS.saveAs(canvas.toDataURL("image/jpeg"), "sample.jpeg");

        const imageData = canvas.toDataURL("image/jpeg");
        const pdf = new jsPDF("l", "mm", "a4");

        var width = pdf.internal.pageSize.getWidth();
        var height = pdf.internal.pageSize.getHeight();

        pdf.addImage(imageData, "JPEG", 0, 0, width, height);
        pdf.save("download.pdf");
      });
    },

    downloadToPDF() {
      const doc = new jsPDF();
      /** WITH CSS */
      var canvasElement = document.createElement("canvas");
      html2canvas(this.$refs.content, { canvas: canvasElement }).then(function(
        canvas
      ) {
        const img = canvas.toDataURL("image/jpeg", 0.8);
        doc.addImage(img, "JPEG", 20, 20);
        doc.save("sample.pdf");
      });
    },

    saveAs(uri, filename) {
      var link = document.createElement("a");

      if (typeof link.download === "string") {
        link.href = uri;
        link.download = filename;

        //Firefox requires the link to be in the body
        document.body.appendChild(link);

        //simulate click
        link.click();

        //remove the link when done
        document.body.removeChild(link);
      } else {
        window.open(uri);
      }
    }
  }
};
</script>

<style>
/*** EXAMPLE ***/
#content {
  width: 100%;
}

.vue-grid-layout {
  background: #eee;
}

.layoutJSON {
  background: #ddd;
  border: 1px solid black;
  margin-top: 10px;
  padding: 10px;
}

.eventsJSON {
  background: #ddd;
  border: 1px solid black;
  margin-top: 10px;
  padding: 10px;
  height: 100px;
  overflow-y: scroll;
}

.columns {
  -moz-columns: 120px;
  -webkit-columns: 120px;
  columns: 120px;
}

.vue-grid-item:not(.vue-grid-placeholder) {
  background: #ccc;
  border: 1px solid black;
}

.vue-grid-item.resizing {
  opacity: 0.9;
}

.vue-grid-item.static {
  background: #cce;
}

.vue-grid-item .text {
  font-size: 24px;
  text-align: center;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  height: 100%;
  width: 100%;
}

.vue-grid-item .no-drag {
  height: 100%;
  width: 100%;
}

.vue-grid-item .minMax {
  font-size: 12px;
}

.vue-grid-item .add {
  cursor: pointer;
}

.vue-draggable-handle {
  position: absolute;
  width: 20px;
  height: 20px;
  top: 0;
  left: 0;
  background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10'><circle cx='5' cy='5' r='5' fill='#999999'/></svg>")
    no-repeat;
  background-position: bottom right;
  padding: 0 8px 8px 0;
  background-repeat: no-repeat;
  background-origin: content-box;
  box-sizing: border-box;
  cursor: pointer;
}
.html2canvas-container {
  width: 3000px !important;
  height: 3000px !important;
}
</style>