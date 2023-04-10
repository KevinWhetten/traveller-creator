﻿using SectorCreator.Global;

namespace SectorCreator.Models.RTTWorldgen.Planets;

public interface ITelluricPlanet
{
    RttWorldgenPlanet Generate(RttWorldgenPlanet planet);
}

public class TelluricPlanet : ITelluricPlanet
{
    private readonly IRollingService _rollingService;
    private readonly IPlanetValidation _planetValidation;

    public TelluricPlanet(IRollingService rollingService, IPlanetValidation planetValidation)
    {
        _rollingService = rollingService;
        _planetValidation = planetValidation;
    }
    
    public RttWorldgenPlanet Generate(RttWorldgenPlanet planet)
    {
        planet.Size = _rollingService.D6(1) + 4;
        planet.Atmosphere = 12;
        planet.Hydrographics = GetHydrographics();
        planet.Biosphere = 0;
        planet = _planetValidation.ValidatePlanet(planet);
        return planet;
    }

    private int GetHydrographics()
    {
        return _rollingService.D6(1) switch {
                    (<= 4) => 0,
                    (<= 6) => 15,
                    _ => 0
                };
    }
}