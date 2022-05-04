import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {CharacterService} from "../../../../services/character.service";
import {Router} from "@angular/router";
import {CareerService} from "../../../../services/data-services/career.service";
import {DmService} from "../../../../services/data-services/dm.service";
import {SkillService} from "../../../../services/data-services/skill.service";
import {CharacterMetadataService} from "../../../../services/metadata-services/character-metadata.service";
import {LoggingService} from "../../../../services/metadata-services/logging.service";

@Component({
  selector: 'app-university-skills',
  templateUrl: './university-graduation.component.html',
  styleUrls: ['./university-graduation.component.css']
})
export class UniversityGraduationComponent implements OnInit {
  @Output() graduation = new EventEmitter();
  graduationRoll: number;
  success: boolean = false;
  honors: boolean = false;
  failure: boolean = false;

  constructor(private _careerService: CareerService,
              private _characterService: CharacterService,
              private _characterMetadataService: CharacterMetadataService,
              private _dmService: DmService,
              private _loggingService: LoggingService,
              private _skillService: SkillService) {
  }

  ngOnInit(): void {
  }

  updateGraduation($event: number) {
    this.graduationRoll = $event;
  }

  submitGraduation() {
    let graduationResult = this.graduationRoll + this._dmService.getDm(this._characterService.getCharacteristics().Intellect);

    if (graduationResult >= 11) {
      this.getHonorsBonus();
    } else if (graduationResult >= 7) {
      this.getGraduationBonus();
    } else {
      this._loggingService.addLog('I didn\'t graduate...');
      this.failure = true;
    }
    this._characterMetadataService.setCurrentUrl('character-creator/careers');
  }

  private getGraduationBonus() {
    this._loggingService.addLog('I graduated from University!');
    this.success = true;
    this._characterService.increaseSkills(this._characterMetadataService.getUniversitySkills());
    this._characterService.increaseEducation(2);
    this.addCareerBonuses(1);
    this.addCommissions();
  }

  private getHonorsBonus() {
    this._loggingService.addLog('I graduated from University with Honors!');
    this.honors = true;
    this._characterService.increaseSkills(this._characterMetadataService.getUniversitySkills());
    this._characterService.increaseEducation(2);
    this.addCareerBonuses(2);
    this.addCommissions(2);
  }

  private addCareerBonuses(amount: number) {
  }

  private addCommissions(amount: number = 0) {
  }

  moveOn() {
    this._characterMetadataService.setCurrentUrl('character-creator/careers');
  }
}
