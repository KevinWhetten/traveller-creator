import {Component, OnInit} from '@angular/core';
import {Career} from "../../../models/career";
import {CareerService} from "../../../services/data-services/career.service";
import {CharacterMetadataService} from "../../../services/metadata-services/character-metadata.service";

@Component({
  selector: 'app-career-mishap',
  templateUrl: './career-mishap.component.html',
  styleUrls: ['./career-mishap.component.css']
})
export class CareerMishapComponent implements OnInit {
  career: Career;
  mishapRoll: number = 0;

  constructor(private _careerService: CareerService,
              private _metadataService: CharacterMetadataService) {
  }

  ngOnInit(): void {
    this.career = this._careerService.getCareer(this._metadataService.getCurrentCareer());
  }

  submit() {
    if(1 <= this.mishapRoll && this.mishapRoll <= 6)
    this._metadataService.setEventNumber(this.mishapRoll);
    this._metadataService.setCurrentUrl('character-creator/careers/mishap/agent');
  }
}
