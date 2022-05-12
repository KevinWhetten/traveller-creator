import {Component, OnInit, ViewChild} from '@angular/core';
import {CareerService} from "../../../services/data-services/career.service";
import {CharacterService} from "../../../services/character.service";
import {CharacterMetadataService} from "../../../services/metadata-services/character-metadata.service";
import {RollingService} from "../../../services/data-services/rolling.service";

@Component({
  selector: 'app-careers',
  templateUrl: './career-selection.component.html',
  styleUrls: ['./career-selection.component.scss']
})
export class CareerSelectionComponent implements OnInit {
  career = this._careerService.getCareer('Agent');
  careerName: string = "Agent";
  assignment: string;

  constructor(private _careerService: CareerService,
              private _characterService: CharacterService,
              private _metadataService: CharacterMetadataService,
              private _rollingService: RollingService) {
  }

  ngOnInit(): void {
  }

  defineNumber(number: number) {
    return Array(number).fill(1).map((x, i) => i + 1);
  }

  getCareerNames() {
    return this._careerService.careerNames;
  }

  changeCareer() {
    this.career = this._careerService.getCareer(this.careerName);
  }

  chooseCareer() {
    this._metadataService.setCurrentCareer(this.career.Name);
    this._metadataService.setCurrentUrl('character-creator/careers/qualification');
  }
}