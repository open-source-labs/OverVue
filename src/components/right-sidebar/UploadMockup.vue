<!-- 
Description:
  Displays Mockup Image upload dropdown as well as minified mockup image once selected
  Functionality includes: importing and clearing mockup image
  -->

<!-- <template>
  <div id="uploadImgMenuItem">
    <q-list>
      <q-expansion-item expand-separator :label="this.mockupUploadLabel">
        <div class="upload">
          <q-btn
            class="upload-btn"
            color="secondary"
            label="Upload Mockup"
            @click="importMockup"
          />
          <q-btn
            v-if="source !== ''"
            class="upload-btn deleteAction"
            color="secondary"
            label="Clear Image"
            @click="removeImage"
          />
          <q-btn
            v-else
            disable
            class="upload-btn deleteAction"
            label="Clear Image"
          />
        </div>
        <div class="file-path">
          <q-card>
            <img
              class="img"
              v-if="this.imagePath[this.activeRoute] !== ''"
              :src="'file:///' + this.imagePath[this.activeRoute]"
            />
          </q-card>
        </div>
      </q-expansion-item>
    </q-list>
  </div>
</template> -->

<!-- <script setup>
import { mapState, mapActions } from "vuex";
import uploadImage from "../../utils/uploadImage.util";
import clearImageDialog from "../../utils/clearImage.util";
import { useStore } from "vuex";
import { ref, computed, watch } from "vue";


const store = useStore();
//data;
const files = ref([]);
const source = ref("");
const mockupUploadLabel = ref(`Upload mockup image for ${activeRoute}`)

//computed
const imagePath = computed(() => store.state.imagePath);
const activeRoute = computed(() => store.state.activeRoute);

//methods
const importImage = (payload) => store.dispatch("importImage", payload);
const clearImage = (payload) => store.dispatch("clearImage", payload);

    // imports mockup image
    // ** Importing mockup image ONLY works in build mode due to path differences
    // In dev mode, error thrown is: "Not allowed to load local resource: PATH "
  const importMockup = () => {
      // A promise gets returned out from uploadImage, imported from uploadImage utils
      const helperPromise = uploadImage();
      helperPromise
        // res contains the selected file path (string)
        .then((res) => {
          if (activeRoute !== "") {
            importImage({ img: res, route: activeRoute });
            if (imagePath[activeRoute]) {
              source.value = "file://" + imagePath[activeRoute];
              console.log(source.value);
            }
          }
        })
        .catch((err) => console.log(err));
    }

    // removes mockup image
  const removeImage = () => {
      const responsePromise = clearImageDialog();

      responsePromise
        .then((res) => {
          // res will have format: { response: 0, checkboxChecked: false }
          // res.response will be 0 if user chose 'Yes'
          // res.response will be 1 if user chose 'Cancel'
          if (res.response === 0) {
            clearImage({ route: activeRoute });
            source.value = imagePath[activeRoute];
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }

    // imports image on browser
    // currently images aren't able to be stored on browser
  const importMockupBrowser = async () => {
      files = $refs.myFiles.files[0];
      await importImage(files.name);
    }
    // removes image on browser
  const removeImageBrowser = () => {
      clearImage();
    }

  // watches for changes in state to activeRoute
    // once you change your active route, the mockup image should change as well
    watch(activeRoute, () => {
      mockupUploadLabel = `Upload mockup image for ${activeRoute}`
      if (imagePath[activeRoute]) {
        // if there is a uploaded image
        source.value = "file:///" + imagePath[activeRoute];
      } else {
        source.value = "";
      }
    })
</script> -->


<!-- old options api script -->
<!-- <script>
import { mapState, mapActions } from "vuex";
import uploadImage from "../../utils/uploadImage.util";
import clearImageDialog from "../../utils/clearImage.util";

export default {
  name: "upload-image",
  data() {
    return {
      files: [],
      source: "",
      mockupUploadLabel: `Upload mockup image for ${this.$store.state.activeRoute}`,
    };
  },
  computed: {
    ...mapState(["imagePath", "activeRoute"]),
  },
  methods: {
    ...mapActions(["importImage", "clearImage"]),
    // imports mockup image
    // ** Importing mockup image ONLY works in build mode due to path differences
    // In dev mode, error thrown is: "Not allowed to load local resource: PATH "
    importMockup() {
      // A promise gets returned out from uploadImage, imported from uploadImage utils
      const helperPromise = uploadImage();
      helperPromise
        // res contains the selected file path (string)
        .then((res) => {
          if (this.activeRoute !== "") {
            this.importImage({ img: res, route: this.activeRoute });
            if (this.imagePath[this.activeRoute]) {
              this.source = "file://" + this.imagePath[this.activeRoute];
              console.log(this.source);
            }
          }
        })
        .catch((err) => console.log(err));
    },
    // removes mockup image
    removeImage() {
      const responsePromise = clearImageDialog();

      responsePromise
        .then((res) => {
          // res will have format: { response: 0, checkboxChecked: false }
          // res.response will be 0 if user chose 'Yes'
          // res.response will be 1 if user chose 'Cancel'
          if (res.response === 0) {
            this.clearImage({ route: this.activeRoute });
            this.source = this.imagePath[this.activeRoute];
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // imports image on browser
    // currently images aren't able to be stored on browser
    async importMockupBrowser() {
      this.files = this.$refs.myFiles.files[0];
      await this.importImage(this.files.name);
    },
    // removes image on browser
    removeImageBrowser() {
      this.clearImage();
    },
  },
  // watches for changes in state to activeRoute
  watch: {
    // once you change your active route, the mockup image should change as well
    activeRoute: function () {
      this.mockupUploadLabel = `Upload mockup image for ${this.activeRoute}`
      if (this.imagePath[this.activeRoute]) {
        // if there is a uploaded image
        this.source = "file:///" + this.imagePath[this.activeRoute];
      } else {
        this.source = "";
      }
    },
  },
};
</script> -->



<!-- <style lang="scss">

#uploadImgMenuItem {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  margin-top: 30px;
}

.q-expansion-item {
    margin-bottom: 10px;
  }

.upload-btn {
  text-transform: uppercase;
  font-size: 12px;
  width: 150px;
  height: auto;
  min-height: 42px;
  margin-left: 10px;
  margin-right: 10px;
}

.upload {
  margin: 1rem;
  display: flex;
  justify-content: center;
}

.file-path {
  padding-bottom: 1em;
  height: 100%;
  margin: 1rem;
  font-size: 11px;

}

.file-header {
  padding-left: 0.4em;
}

.file-content {
  padding: 0em 1em 1em 1em;

}

.browser-btn {
  width: 90px;
  background: $secondary;
}

.img {
  max-height: 200px;
}
</style> -->
