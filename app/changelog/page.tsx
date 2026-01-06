import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";

export default function Page() {
  return (
    <main className="flex-row items-center justify-center">
      <h1 className="text-center text-xl font-semibold mb-2">Changelog</h1>
      <Item variant={"outline"} className="mb-2">
        <ItemContent>
          <ItemTitle className="underline">v0.4.0</ItemTitle>
          <ItemDescription>Add changelog pages</ItemDescription>
          <ItemDescription>Add math operation in input field</ItemDescription>
          <ItemDescription>Set default number of player from 3 to 4</ItemDescription>
        </ItemContent>
      </Item>
    </main>
  );
}
