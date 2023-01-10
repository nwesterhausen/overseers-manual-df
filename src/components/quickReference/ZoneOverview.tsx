import { Component } from 'solid-js';

const ZoneOverview: Component = () => {
  return (
    <div>
      <h3>Zones</h3>
      <ul>
        <li>
          <a href='#animal-training'>Animal Training</a>
        </li>
        <li>
          <a href='#archery-range'>Archery Range</a>
        </li>
        <li>
          <a href='#barracks'>Barracks</a>
        </li>
        <li>
          <a href='#bedroom'>Bedroom</a>
        </li>
        <li>
          <a href='#clay-collection'>Clay Collection</a>
        </li>
        <li>
          <a href='#dining-room'>Dining Room/Hall</a>
        </li>
        <li>
          <a href='#dungeon'>Dungeon</a>
        </li>
        <li>
          <a href='#fishing'>Fishing</a>
        </li>
        <li>
          <a href='#garbage-dump'>Garbage Dump</a>
        </li>
        <li>
          <a href='#gather-fruit'>Gather Fruit</a>
        </li>
        <li>
          <a href='#meeting-area'>Meeting Area</a>
        </li>
        <li>
          <a href='#office'>Office</a>
        </li>
        <li>
          <a href='#pen-pasture'>Pen/Pasture</a>
        </li>
        <li>
          <a href='#pit-pond'>Pit/Pond</a>
        </li>
        <li>
          <a href='#sand-collection'>Sand Collection</a>
        </li>
        <li>
          <a href='#tomb'>Tomb</a>
        </li>
        <li>
          <a href='#water-source'>Water Source</a>
        </li>
      </ul>
      <section>
        <h5 id='meeting-area'>Meeting Area</h5>
        <p>
          Meeting area zones are zones in which idle dwarves and animals will congregate. Additionally, immigrants will
          collect at a meeting area until their "migrant" status wears off. Note that the wagon you arrive with
          constitutes a meeting area until you designate the first meeting area of your own. If you start in hostile
          surroundings, it is important to do so, so as to get your dwarves and animals out of danger quickly. It is a
          good idea to have at least one meeting area of one form or another: It allows you to make off-duty dwarves and
          animals gather in an area where they are not vulnerable within the fortress. A meeting area filled with
          dwarves increases the social skills of idlers. It makes idle dwarves a little less idle. Because almost every
          dwarf visits a meeting area at least occasionally, it's an ideal place to site valuable objects and buildings.
          Note that having dwarves socialize will often result in them forming relationships.
        </p>
        <p>Variations:</p>
        <ul>
          <li>plain meeting area: no furniture in zone</li>
          <li>memorial hall: have a tomb or engraved slab in selection</li>
          <li>others?...</li>
        </ul>
      </section>
      <section>
        <h5 id='office'>Office</h5>
        <p>
          An office is a zone required by some nobles, most notably the manager and bookkeeper. Nobles like the mayor,
          baron, and other esteemed{' '}
        </p>
        <p>Furniture Requirements (zone will not work without):</p>
        <ul>
          <li>a chair</li>
        </ul>
        <p>Thematic and/or helpful furniture to add:</p>
        <ul>
          <li>cabinets (dwarves will store extra/unused clothing they own in cabinets)</li>
          <li>chests (dwarves will store their owned items in chests)</li>
          <li>bookcases (these look nice in an office)</li>
          <li>tables (having a table will make the office look nicer, but may encourage eating)</li>
          <li>statues (can improve the value of the room)</li>
        </ul>
      </section>
      <section>
        <h5 id='bedroom'>Bedroom</h5>
        <p>
          A bedroom is a zone where a single dwarf (and possibly their spouse and babies) will sleep and store their
          belongings in. Bedrooms are automatically claimed by dwarves (or spouses of dwarves); or they may be manually
          assigned to a dwarf. Once a bedroom has an owner, it becomes the private quarters for that dwarf, where they
          will sleep, store any belongings that are not carried, and hang out in if there is no meeting area. Assigning
          a dwarf a new bedroom will NOT un-assign them from their old bedroom(s); if you want them to only have one
          bedroom, you'll need to track down their old bedroom and un-assign it.
        </p>
        <p>Furniture Requirements (zone will not work without):</p>
        <ul>
          <li>a bed</li>
        </ul>
        <p>Thematic and/or helpful furniture to add:</p>
        <ul>
          <li>
            cabinets (dwarves will store extra/unused clothing they own in cabinets){' '}
            <em>Each dwarf using the bedroom needs their own cabinet!</em>
          </li>
          <li>chests (dwarves will store their owned items in chests)</li>
        </ul>
        <p>
          Owning furniture (especially high-quality furniture) gives dwarves happy thoughts, and cabinets and coffers
          give them a place to store their possessions.
        </p>
      </section>
      <section>
        <h5 id='dormitory'>Dormitory</h5>
        <p>
          A dormitory is a zone containing multiple beds where all dwarves that do not have a Bedroom assigned to them
          will sleep. Dormitories contribute less to happiness compared to bedrooms, but it is a good practice to have a
          dormitory available for newly arrived migrants. A higher value dormitory will give better thoughts than a
          meager one, and larger rooms can easily be made valuable by adding many beds.
        </p>
        <p>Furniture Requirements (zone will not work without):</p>
        <ul>
          <li>a bed</li>
        </ul>
      </section>
      <section>
        <h5 id='dining-room'>Dining Room/Hall</h5>
        <p>
          A Dining Hall is a zone where dwarves go to eat. The assigned zone may be either assigned to a specific dwarf
          (usually a noble) or designated as a dining hall. A valuable communal dining hall is an excellent way to
          reduce stress.
        </p>
        <p>Furniture Requirements (zone will not work without):</p>
        <ul>
          <li>a table</li>
        </ul>
        <p>Thematic and/or helpful furniture to add:</p>
        <ul>
          <li>chairs (dwarves like to eat sitting down)</li>
          <li>statues (can improve the value of the room)</li>
        </ul>
        <p>
          A good general rule of thumb is to have enough tables and chairs to serve one fifth (1/5) of your fortress
          population at any given time. Plan ahead for immigrants. More never hurts, but may never be necessary.
        </p>
        <p>
          While it might be common sense to put a chair on either side of a table, or even 4 chairs around a single
          table, in DF one table is only enough for one dwarf. While a dining room of any size is designated from a
          single table, dwarves will receive negative thoughts from eating at a dining room (or anywhere else) without
          both a chair and orthogonally adjacent table to themselves.
        </p>
        <p>
          Dwarves with a table or chair in their quarters may opt to eat their meals there instead of using your
          magnificent dining hall (forgoing the positive thought and possibly generating negative thoughts as well). To
          avoid this, do not install tables or chairs in your non-noble dwarves' quarters.
        </p>
      </section>
      <section>
        <h5 id='barracks'>Barracks</h5>
        <p>A Barracks zone is a zone where a military will go to sleep, train, or store their equipment.</p>
        <p>
          Furniture Requirements (if designated for <strong>Sleep</strong>):
        </p>
        <ul>
          <li>a bed for each dwarf in the assigned squad</li>
        </ul>
        <p>
          Furniture Requirements (if designated for <strong>Training</strong>):
        </p>
        <ul>
          <li>(none, although barracks only train melee and general combat skills)</li>
        </ul>
        <p>
          Furniture Requirements (if designated for <strong>Individual/Squad Equipment</strong>):
        </p>
        <ul>
          <li>a chest/cabinet/armor stand for each dwarf in the assigned squad</li>
        </ul>
      </section>
      <section>
        <h5 id='pit-pond'>Pit/Pond</h5>
        <p>
          A pit/pond zone is a location for dwarves to dump caged animals and creatures into a <em>pit</em> or dump
          buckets of water to make a <em>pond</em>. Creatures can be assigned to a pit/pond. If the creature is caged, a
          dwarf will release it from the cage (rather than bringing the cage to the pit), and then lead the beast to the
          pit and throw it in. The only real difference between a pit and a pond is that dwarves will attempt to fill a
          pond with water, carried by bucket from a <a href='#water-source'>water source</a>. Each bucketful increases
          the depth of the water in the tile below by 1/7. Once the water is dumped from the bucket, the dwarf will
          either drop the bucket and perform a different task, or choose to fill a pond zone tile again using the bucket
          (s)he currently holds. Dwarves will stop scheduling the Fill Pond job when the water depth reaches 6/7.
        </p>
        <p>Zone Requirements:</p>
        <ul>
          <li>A Pit/Pond requires a ramp or hole with adjacent flooring on which a dwarf can stand.</li>
        </ul>
        <p>
          Specifying a pond zone is one technique used for irrigation, in order to make mud for farming on areas without
          soil. Currently, no matter how large the designated pond area, only one dwarf at a time will try to fill the
          pond. In order to fill a large area quickly, it is necessary to designate multiple smaller pond zones (or
          several zones overlapping the same area).
        </p>
      </section>
      <section>
        <h5 id='pen-pasture'>Pen/Pasture</h5>
        <p>
          A pen or a pasture is used to contain tame animals. Once one is created, animals must be assigned to it
          individually from the zone information menu. Dwarves will drag the assigned animals to the pen or pasture
          automatically. Domestic animals tend to aggregate at meeting areas instead, as will herbivorous ones, which
          will lead to probably starvation unless your meeting area is overgrown with grass or fungi for some reason.
          Any tame creature with the "grazer" token in the raws should be assigned to a pasture.
        </p>
      </section>
      <section>
        <h5 id='tomb'>Tomb</h5>
        <p>
          A tomb is a zone in which dwarves and pets can be buried. A tomb can be assigned to a specific dwarf, or to
          accept dwarves and/or pets for burial. The primary function of tombs is to keep nobles happy: certain nobles
          demand their own tomb, and the more self-important the noble is, the higher the quality they will require.
        </p>
        <p>
          The quality levels of tombs go as follows: Grave, Servant's Burial Chamber, Burial Chamber, Tomb, Fine Tomb,
          Mausoleum, Grand Mausoleum, Royal Mausoleum.
        </p>
        <p>
          Dwarves that have been assigned to tombs will retain all of their possessions when they die, and other dwarves
          will place them in the tomb - it can be a good idea to keep a chest or cabinet in the tomb to ensure that all
          of the items fit; otherwise, all of the dwarf's possessions will be inherited by their spouse (if one exists)
          or simply become unowned.
        </p>
      </section>
      <section>
        <h5 id='garbage-dump'>Garbage Dump</h5>
        <p>
          Garbage dump zones are areas in which dwarves will throw items marked for dumping. Garbage dumps are not the
          same as refuse stockpiles, which can be designated to accept specific type(s) of refuse, such as animal
          corpses or bones, and then are automatically filled by haulers whenever the items appear on the map.
        </p>
        <p>
          Be aware that if a garbage zone is designated beside a cliff or hole (any open space, either natural or
          dwarf-made), garbage will be thrown into the open space. If a dump is designated over a ramp to the next level
          down, some dwarves may walk down the ramp to dump their items, while others may just toss their items down
          from above and onto those dwarves, injuring or killing them.
        </p>
      </section>
      <section>
        <h5 id='water-source'>Water Source</h5>
        <p>
          Dwarves will use these zones to draw water, to satisfy booze-less thirst, to tend to another thirsty dwarf
          (with the Give Water job), or to fill a Pond zone. Only tiles adjacent to water qualify as usable water
          sources - thus, if you want to place a single-tile zone, place the zone onto a ground tile next to the water,
          not over the water itself. This zone should not be used with wells - this is redundant, as they are already
          considered their own water source.
        </p>
      </section>
      <section>
        <h5 id='animal-training'>Animal Training</h5>
        <p>
          An animal training zone allows animal training. Animals cannot be trained unless they are in a training zone
          or pasture or on a restraint. To be tamed, they must be in a cage.
        </p>
      </section>
      <section>
        <h5 id='archery-range'>Archery Range</h5>
        <p>Archery ranges are used to train marksdwarves. They require archery targets.</p>
      </section>
      <section>
        <h5 id='dungeon'>Dungeon</h5>
        <p>
          A dungeon, also known as a prison, its rooms known as jails, is a zone used by the justice system within your
          dwarven community. As your dwarves break the law, your Sheriff/Captain of the Guard, or any Fortress Guard,
          will place them in one of the designated restraints, dragging their prisoner to the dungeon regardless of
          their strength, or even if they transform into a werebeast halfway there.
        </p>
        <p>Require cages or restraints (chains/ropes)</p>
      </section>
      <section>
        <h5 id='fishing'>Fishing</h5>
        <p>
          Dwarves will preferably use these zones when fishing, using them up until their supply is exhausted before
          moving on to the next water source. As with water sources, only tiles adjacent to water qualify as usable
          tiles. Far-flung fisherdwarves fishing in a distant river or pool are a serious defensive liability in case of
          an attack, so designating a safer fishing zone and, optionally, restricting non-zone fishing in the standing
          orders menu will help keep your fisherdwarves safe. Dwarves can fish through a grate or even a well, provided
          there is water in the tile 1 z-level below the activity zone.
        </p>
      </section>
      <section>
        <h5 id='gather-fruit'>Gather Fruit</h5>
        <p>
          This will automate plant-gathering jobs in this area, necessary if you want your dwarves to collect fruit from
          the floor or trees. If there are fruit-bearing trees in the designated area, a dwarf will fetch a stepladder
          to climb into the tree. The ladder-using dwarf will drop harvested fruit to the ground for others to collect
          and haul. The details can be set in a sub-menu.
        </p>
      </section>
      <section>
        <h5 id='sand-collection'>Sand Collection</h5>
        <p>
          A sand collection zone allows dwarves with the item hauling labor active to fill an unused bag with sand for
          use in the glass industry. The 'collect sand' task is created at a glass furnace.
        </p>
      </section>
      <section>
        <h5 id='clay-collection'>Clay Collection</h5>
        <p>
          A clay collection zone allows dwarves with the item hauling labor active to create clay for use in the ceramic
          industry. The 'collect clay' task is created at a kiln.
        </p>
      </section>
    </div>
  );
};

export default ZoneOverview;
