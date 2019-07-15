<template>
  <div class="home-sidebar drawer-menu">
    <q-list>
      <q-expansion-item dense dense-toggle expand-separator label="Upload Mockup Image">
        <div class="upload">
          <!-- for electron, below is for browser usage
          <q-btn class="upload-btn" color="secondary" label="Upload Mockup" @click="importMockup" />-->
          <form enctype="multipart/form-data" action="/upload/image" method="post">
            <input
              type="file"
              class="browser-btn"
              ref="myFiles"
              accept="image/*"
              @change="importMockupBrowser"
            />
          </form>
          <q-btn
            v-if="imageExists"
            class="upload-btn"
            color="secondary"
            label="Clear Image"
            @click="removeImageBrowser"
          />
          <!-- for electron 
            <q-btn
            v-if="imageExists"
            class="upload-btn"
            color="secondary"
            label="Clear Image"
            @click="removeImage"
          />-->
          <q-btn v-else disable class="upload-btn" color="secondary" label="Clear Image" />
        </div>
        <div class="file-path">
          <q-card>
            <img :src="[imageExists ? `file:///${imagePath[0]}` : ' ']" />

            <q-card-section>
              <div class="text-h6 file-header">File Path</div>
              <div class="text-subtitle2 file-content">{{ imagePath[0] }}</div>
            </q-card-section>
          </q-card>
        </div>
      </q-expansion-item>
    </q-list>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
/**
 * Electron functionality
 */
// import uploadImage from '../utils/uploadImage.util'
// import clearImageDialog from '../utils/clearImage.util'

export default {
  name: "upload-image",
  data() {
    return {
      files: []
    };
  },
  computed: {
    ...mapState(["imagePath"]),
    imageExists() {
      return this.imagePath.length;
    }
  },
  methods: {
    ...mapActions(["importImage", "clearImage"]),
    /**
     * @description: for use with electron
     */
    importMockup() {
      // const img = uploadImage()
      // this.importImage(img)
    },
    removeImage() {
      // const res = clearImageDialog()
      // if (res === 0) this.clearImage()
    },
    /**
     * @description: for use with the browser
     * currently needs an approach for storing the file on the browser..
     * also, needs async functionality to update state in store (yet we cant even save the file so its useless, gonna check out local storage)
     */
    async importMockupBrowser() {
      console.log(`importMockupBrowser: ${this.$refs.myFiles.files}`);
      this.files = this.$refs.myFiles.files[0];
      await this.importImage(this.files.name);
      await console.log(this.files.name);
    },
    removeImageBrowser() {
      this.clearImage();
    }
  }
};
</script>

<style lang="stylus">
.home-sidebar {
  margin: 1rem;
  justify-content: center;
  border-radius: 5px;
}

.upload-btn {
  text-transform: capitalize;
  font-size: 12px;
}

.upload {
  margin: 0.5rem;
  display: flex;
  justify-content: space-evenly;
}

.file-path {
  padding-bottom: 1rem;
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
</style>
