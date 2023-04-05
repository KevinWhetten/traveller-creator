﻿using SectorCreator.Global;
using SectorCreator.Models.Base;

namespace SectorCreator.Models.StarFrontiers;

public class StarFrontiersSubsector : Subsector
{
  public StarFrontiersSubsector(Coordinates coordinates)
  {
    Generate(coordinates);
  }

  private void Generate(Coordinates coordinates)
  {
    Coordinates = coordinates;

    for (var y = 1; y <= 10; y++)
    {
      for (var x = 1; x <= 8; x++)
      {
        var newHex = new StarFrontiersHex(Coordinates, new Coordinates(x, y));
        Hexes.Add(newHex);
      }
    }
  }
}
