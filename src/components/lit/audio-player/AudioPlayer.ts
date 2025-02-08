import { getInstantVolume, getSimpleInstantLUFS } from "@/utils/helpers";
import { LitElement, html, css } from "lit";
import { customElement, property, query } from "lit/decorators.js";

@customElement("oh-audio-player")
export class AudioPlayer extends LitElement {
  @property() src!: string;
  @property() audioContext!: AudioContext;
  @query("#audio-file") audio!: HTMLAudioElement;

  private analyser!: AnalyserNode;
  private dataArray!: Uint8Array;
  private bufferLength!: number;
  private isMuted: boolean = false;
  private isPlaying: boolean = false;

  private getValues() {
    if (!this.audio.paused) {
      const rms = getInstantVolume(this.bufferLength, this.dataArray, this.analyser);
      const lufs = getSimpleInstantLUFS(rms);

      this.dispatchEvent(new CustomEvent("volume-change", {
        detail: { rms, lufs },
      }));
    }

    requestAnimationFrame(() => this.getValues());
  }

  protected async firstUpdated() {
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 256;

    const audioSource = this.audioContext.createMediaElementSource(this.audio);
    audioSource.connect(this.analyser);
    this.analyser.connect(this.audioContext.destination);

    this.bufferLength = this.analyser.frequencyBinCount;
    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);

    this.getValues();

    this.audio.addEventListener("play", this.onPlay);
    this.audio.addEventListener("pause", this.onPause);
    this.audio.addEventListener("volumechange", this.onVolumeChange);
  }

  private onPlay = () => {
    this.isPlaying = true;
    this.dispatchEvent(new CustomEvent("audio-play", { bubbles: true, composed: true }));
  };

  private onPause = () => {
    this.isPlaying = false;
    this.dispatchEvent(new CustomEvent("audio-pause", { bubbles: true, composed: true }));
  };

  private onVolumeChange = () => {
    this.isMuted = this.audio.muted || this.audio.volume === 0;
    this.dispatchEvent(new CustomEvent("audio-mute", {
      detail: { muted: this.isMuted },
      bubbles: true,
      composed: true,
    }));
  };

  render() {
    return html`
      <audio
        id="audio-file"
        controls
        .src="${this.src}"
        ?muted="${this.isMuted}"
        @play="${this.onPlay}"
        @pause="${this.onPause}"
        @volumechange="${this.onVolumeChange}"
      ></audio>
    `;
  }
}
