﻿import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {PercentageService} from "../../../../services/data-services/percentage.service";
import {LoggingService} from "../../../../services/metadata-services/logging.service";
import {CharacterMetadataService} from "../../../../services/metadata-services/character-metadata.service";
import {RollingService} from "../../../../services/data-services/rolling.service";
import {CharacterService} from "../../../../services/character.service";

@Component({
  selector: 'app-event-draft',
  templateUrl: './event-draft.component.html',
  styleUrls: ['./event-draft.component.css']
})
export class EventDraftComponent implements OnInit {
  @Output() graduate = new EventEmitter();
  private log: string;
  avoidDraftRoll: number;
  avoidDraftFailure: boolean;
  socialStatusDm: number = this._dmService.getDm(this._characterService.getSocialStatus());
  avoidDraftAttempt: boolean;

  constructor(private _characterService: CharacterService,
              private _characterMetadataService: CharacterMetadataService,
              private _dmService: RollingService,
              private _loggingService: LoggingService,
              public _percentageService: PercentageService) {
  }

  ngOnInit(): void {
  }

  drafted() {
    // Add Term
    this._loggingService.addLog('War came and a wide-ranging draft was instigated. I chose to be drafted, so I didn\'t graduate.');
    this._characterMetadataService.setCurrentUrl('character-creator/careers/draft');
  }

  avoidDraft() {
    this.log = 'War came and a wide-ranging draft was instigated. I tried to get enough strings pulled to avoid the draft and complete my education,';
    if (this.avoidDraftRoll + this._dmService.getDm(this._characterService.getCharacteristics().SocialStatus) >= 9) {
      this.log += ' and succeeded!';
      this.graduate.emit();
    } else {
      this.log += ' but failed.';
      this.avoidDraftFailure = true;
    }
    this._loggingService.addLog(this.log);
  }

  fleeDraft() {
    this._loggingService.addLog('War came and a wide-ranging draft was instigated. I chose to be flee and become a Drifter next term. I also didn\'t graduate.');
    this._characterMetadataService.setCurrentUrl('character-creator/careers/drifter');
  }
}