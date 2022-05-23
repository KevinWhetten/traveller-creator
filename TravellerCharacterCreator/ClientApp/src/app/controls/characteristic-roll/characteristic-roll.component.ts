import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AlertType} from "../alert/alert.component";
import {CharacterService} from "../../services/character.service";
import {CharacterMetadataService} from "../../services/metadata-services/character-metadata.service";
import {RollingService} from "../../services/data-services/rolling.service";

@Component({
  selector: 'app-characteristic-roll',
  templateUrl: './characteristic-roll.component.html',
  styleUrls: ['./characteristic-roll.component.scss']
})
export class CharacteristicRollComponent implements OnInit {
  @Input() characteristic: string;
  @Input() target: number;
  @Input() extraMod: number = 0;
  @Output() rolled = new EventEmitter<boolean>();
  @Output() result = new EventEmitter<number>();
  @Output() rawResult = new EventEmitter<{roll: number, modifier: number, passed: boolean}>();

  roll: number;
  hasError: boolean;
  errorMessage: string;
  error = AlertType.Error;

  constructor(private _characterService: CharacterService,
              private _metadataService: CharacterMetadataService,
              private _rollingService: RollingService) {
  }

  ngOnInit(): void {
  }

  getModifier() {
    switch(this.characteristic){
      case 'STR':
        let strengthScore = this._characterService.getStrength().current;
        return this._rollingService.getDm(strengthScore);
      case 'DEX':
        let dexterityScore = this._characterService.getDexterity().current;
        return this._rollingService.getDm(dexterityScore);
      case 'END':
        let enduranceScore = this._characterService.getEndurance().current;
        return this._rollingService.getDm(enduranceScore);
      case 'INT':
        let intellectScore = this._characterService.getIntellect().current;
        return this._rollingService.getDm(intellectScore);
      case 'EDU':
        let educationScore = this._characterService.getEducation().current;
        return this._rollingService.getDm(educationScore);
      case 'SOC':
        let socialStatusScore = this._characterService.getSocialStanding().current;
        return this._rollingService.getDm(socialStatusScore);
      default:
        return 0;
    }
  }

  submit() {
    if (2 <= this.roll && this.roll <= 12) {
      let result = this.roll + this.getModifier() + this.extraMod;
      let totalMod = this.getModifier() + this.extraMod;

      if (result >= this.target) {
        this.rawResult.emit({roll: this.roll, modifier: totalMod, passed: true});
        this.rolled.emit(true);
      } else {
        this.rawResult.emit({roll: this.roll, modifier: totalMod, passed: false});
        this.rolled.emit(false);
      }
      this.result.emit(result);
    } else {
      this.hasError = true;
      this.errorMessage = 'The roll must be between 2 and 12.';
    }
  }
}